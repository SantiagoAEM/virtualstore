import { useState } from "react";

export type ProductImage = {
  id: number;
  url: string;
  alt?: string;
  color?: string; // color hex o nombre, opcional
};

type Props = {
  images?: ProductImage[];
  initialIndex?: number;
  onSelectColor?: (color?: string) => void;
};

export default function ProductGallery({ images = [], initialIndex = 0, onSelectColor }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const visibleImages = images.slice(0, 5); // muestra 5 miniaturas
  const colors = Array.from(new Set(images.map((i) => i.color).filter(Boolean)));

  const selected = images[index] ?? images[0];

  return (
    <div className="flex gap-6">
      {/* Thumbnails verticales */}
      <div className="flex flex-col gap-3">
        {visibleImages.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setIndex(i)}
            className={`w-20 h-20 overflow-hidden rounded border transition-all ${
              images[index]?.id === img.id ? "ring-2 ring-primary" : "border-gray-200"
            }`}
          >
            <img src={img.url} alt={img.alt ?? ""} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>

      {/* Imagen principal */}
      <div className="flex-1">
        <div className="aspect-[4/3] w-full rounded overflow-hidden border">
          {selected ? (
            <img src={selected.url} alt={selected.alt ?? ""} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
              Sin imagen
            </div>
          )}
        </div>

        {/* Swatches de color */}
        {colors.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  const idx = images.findIndex((im) => im.color === c);
                  if (idx >= 0) setIndex(idx);
                  onSelectColor?.(c);
                }}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  images[index]?.color === c ? "scale-110 ring-2 ring-offset-1" : ""
                }`}
                style={{ backgroundColor: c }}
                aria-label={`color ${c}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}