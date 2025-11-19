import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDelete from './ui/confirm-delete';

interface Image {
    id: number;
    path: string;
    is_main: boolean;
}

export interface VariationWithImages {
    id: number;
    name: string;
    type: 'color' | 'size' | 'style' | 'type';
    code?: string | null;
    price?: number | null;
    quantity?: number | null;
    images: Image[];
}

interface VariationProps {
    variations: VariationWithImages[];
    onSelectVariation?: (variationId: number) => void;
}

export default function ProductGallery({
    variations,
    onSelectVariation,
}: VariationProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selected, setSelected] = useState(variations[0]);
    const [mainImage, setMainImage] = useState<Image | undefined>(
        selected.images.find((i) => i.is_main) || selected.images[0],
    );

    function handleSetMain(img: Image) {
        router.post(
            `/products/product-images/${img.id}/set-main`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSelected((prev) => ({
                        ...prev,
                        images: prev.images.map((i) => ({
                            ...i,
                            is_main: i.id === img.id,
                        })),
                    }));
                    setMainImage(img);
                },
                onError: (errors) => {
                    console.error(
                        '❌ Error al cambiar imagen principal:',
                        errors,
                    );
                },
            },
        );
    }

    function handleDeleteImage(img: Image) {
        router.delete(`/products/images/${img.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Actualizar estado local
                setSelected((prev) => {
                    const updatedImages = prev.images.filter(
                        (i) => i.id !== img.id,
                    );

                    // Si se eliminó la imagen principal y quedan imágenes, marcar la primera como principal
                    if (img.is_main && updatedImages.length > 0) {
                        updatedImages[0].is_main = true;
                        setMainImage(updatedImages[0]);
                    } else if (updatedImages.length === 0) {
                        setMainImage(undefined);
                    } else if (mainImage?.id === img.id) {
                        setMainImage(updatedImages[0]);
                    }

                    return { ...prev, images: updatedImages };
                });
            },
            onError: (errors) => {
                console.error('❌ Error al eliminar imagen:', errors);
            },
        });
    }

    function handleChange(v: VariationWithImages) {
        setSelected(v);
        setMainImage(v.images.find((i) => i.is_main) || v.images[0]);
        onSelectVariation?.(v.id);
    }

    return (
        <div className="space-y-4">
            {/* Selector de variación */}
            <div className="flex gap-2">
                {variations.map((v) => (
                    <Button
                        key={v.id}
                        style={{
                            backgroundColor:
                                v.type === 'color' && typeof v.code === 'string'
                                    ? v.code
                                    : undefined,
                        }}
                        onClick={() => handleChange(v)}
                        className={
                            selected.id === v.id
                                ? 'ring-2 ring-blue-500'
                                : 'bg-gray-200 text-black'
                        }
                    >
                        {v.name}
                    </Button>
                ))}
            </div>

            {/* Imagen principal + miniaturas */}
            <div className="flex items-start gap-4">
                {/* Imagen principal */}
                <div className="relative w-1/2">
                    {mainImage && (
                        <>
                            <img
                                src={`/storage/${mainImage.path}`}
                                alt="main"
                                className="max-h-[760px] w-full rounded-md object-cover"
                            />
                            <div className="absolute top-2 right-2 rounded-md bg-yellow-500 px-2 py-1 text-xs text-white shadow-md">
                                Main Image
                            </div>
                        </>
                    )}
                </div>

                {/* Miniaturas */}
                <div className="grid max-h-[360px] grid-cols-1 gap-2 overflow-y-auto pr-2 text-white">
                    {selected.images.map((img) => (
                        <div key={img.id} className="group relative">
                            <img
                                src={`/storage/${img.path}`}
                                alt="thumbnail"
                                onClick={() => setMainImage(img)}
                                className={`h-20 w-20 cursor-pointer rounded-md border ${
                                    img.id === mainImage?.id
                                        ? 'border-blue-500'
                                        : 'border-gray-300'
                                }`}
                            />

                            {/* Indicador de estrella si es imagen principal */}
                            {img.is_main && (
                                <div className="absolute top-1 left-1">
                                    <Star
                                        className="h-5 w-5 fill-yellow-300 text-yellow-300"
                                        strokeWidth={2}
                                    />
                                </div>
                            )}

                            {/* Botón para establecer como principal */}
                            {!img.is_main && (
                                <button
                                    type="button"
                                    onClick={() => handleSetMain(img)}
                                    className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100"
                                >
                                    Set as main
                                </button>
                            )}

                            {/* Botón de eliminar */}
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenDialog(true);
                                }}
                                className="absolute top-1 right-1 rounded bg-red-500/80 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                                title="Eliminar imagen"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                            <ConfirmDelete
                                onConfirm={() => handleDeleteImage(img)}
                                title="¿Eliminar Imagen?"
                                description={
                                    'Esto eliminará la imagen y no podrá recuperarse.'
                                }
                                openDialog={openDialog}
                                setOpenDialog={setOpenDialog}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
