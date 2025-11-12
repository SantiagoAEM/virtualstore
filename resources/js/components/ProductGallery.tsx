import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { router } from "@inertiajs/react"; // ✅ Inertia se encarga del CSRF automáticamente

interface Image {
  id: number;
  path: string;
  is_main: boolean;
}

interface Color {
  id: number;
  color_name: string;
  color_code: string;
  images: Image[];
}

interface ColorGalleryProps {
  colors: Color[];
  onSelectColor?: (colorId: number) => void;
}

export default function ProductGallery({ colors, onSelectColor }: ColorGalleryProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [mainImage, setMainImage] = useState(
    selectedColor.images.find((img) => img.is_main) || selectedColor.images[0]
  );

  function handleSetMain(img: Image) {
    router.post(
      `/products/product-images/${img.id}/set-main`,
      {},//  Cuerpo vacío (no envía datos adicionales)
      {
        preserveScroll: true,
        preserveState: true,  // No recarga todo el componente
        onSuccess: () => {
          // Actualiza el estado local inmediatamente sin esperar la respuesta
          setSelectedColor((prev) => ({
            ...prev,
            images: prev.images.map((i) => ({ ...i, is_main: i.id === img.id })),
          }));
          setMainImage(img);
        },
        onError: (errors) => {
          console.error("❌ Error al cambiar imagen principal:", errors);
        },
      }
    );
  }

  function handleColorChange(color: Color) {
    setSelectedColor(color);
    setMainImage(color.images.find((img) => img.is_main) || color.images[0]);
    onSelectColor?.(color.id);
  }

  return (
    <div className="space-y-4">
      {/* Selector de color */}
      <div className="flex gap-2">
        {colors.map((color) => (
          <Button
            key={color.id}
            style={{ backgroundColor: color.color_code }}
            onClick={() => handleColorChange(color)}
            className={selectedColor.id === color.id ? "ring-2 ring-blue-500" : ""}
          >
            {color.color_name}
          </Button>
        ))}
      </div>

      {/* Imagen principal + miniaturas */}
      <div className="flex gap-4 items-start ">
        {/* Imagen principal */}
        <div className="w-1/2 relative ">
          {mainImage && (
            <>
              <img
                src={`/storage/${mainImage.path}`}
                alt="main"
                className="rounded-md w-full object-cover max-h-[760px]"
              />
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
                Main Image
              </div>
            </>
          )}
        </div>

        {/* Miniaturas */}
        <div className="grid grid-cols-1 gap-2 max-h-[360px] text-white overflow-y-auto pr-2">
          {selectedColor.images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={`/storage/${img.path}`}
                alt="thumbnail"
                onClick={() => setMainImage(img)} 
                className={`w-20 h-20 rounded-md cursor-pointer border ${
                  img.id === mainImage.id ? "border-blue-500" : "border-gray-300"
                }`}
              />

              {/* Indicador de estrella si es imagen principal */}
              {img.is_main && (
                <div className="absolute top-1 left-1 rounded-full p-1 bg-transparent">
                  <Star className="w-5 h-5 text-yellow-300  fill-none" strokeWidth={2} />
                </div>
              )}

              {/* Botón para establecer como principal */}
              {!img.is_main && (
                <button
                  type="button"
                  onClick={() => handleSetMain(img)}
                  className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Set as main
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}