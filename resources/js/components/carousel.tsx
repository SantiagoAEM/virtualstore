import { useState, useEffect } from "react";
import { image } from "@/types";

export default function Carousel({ images }: { images: image[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Cuando cambian las imágenes (cambio de variante),
    // reiniciar el índice a 0 para evitar desbordes
    useEffect(() => {
        setActiveIndex(0);
    }, [images]);

    return (
        <div className="flex items-start gap-6">

            {/* thumbnails */}
            <div className="flex flex-col gap-2">
                {images.map((img, i) => (
                    <button
                        key={img.id}
                        onClick={() => setActiveIndex(i)}
                        className={`border-2 rounded-lg overflow-hidden transition 
                            ${activeIndex === i ? "border-blue-500" : "border-gray-300"}`}
                    >
                        <img
                            src={img.thumbnail}
                            className="w-[55px] h-[55px] object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* RIGHT: main image */}
            <div className="w-full">
                <img
                    src={images[activeIndex]?.url}
                    className="w-full rounded-lg"
                />
            </div>
        </div>
    );
}
