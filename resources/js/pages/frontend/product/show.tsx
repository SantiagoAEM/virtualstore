import Carousel from '@/components/carousel';
import { Product, ProductVariation } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import BuyButton from '../components/buy-button';
import CurrencyFormatter from '../components/currency-formatter';

type Props = {
    product: Product;
    activeVariationSlug?: string;
};

export default function Show() {
    const { product, activeVariationSlug } = usePage()
        .props as unknown as Props;

    const initialVariation =
        product.variations.find((v) => v.slug === activeVariationSlug) ??
        product.variations[0];

    const [selectedVariation, setSelectedVariation] =
        useState<ProductVariation>(initialVariation);
    const [quantity, setQuantity] = useState<number>(1);
    const [images, setImages] = useState(() => arrangeImages(initialVariation));

    function arrangeImages(variation: ProductVariation) {
        const main = variation.images.find((img) => img.is_main);
        const others = variation.images.filter((img) => !img.is_main);
        return main ? [main, ...others] : variation.images;
    }

    useEffect(() => {
        setImages(arrangeImages(selectedVariation));
        setQuantity(1);
    }, [selectedVariation]);

    function handleVariationChange(v: ProductVariation) {
        setSelectedVariation(v);
        router.visit(`/product/${product.slug}/v/${v.slug}`, {
            method: 'get',
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    }

    return (
        <div>
            <Head title={`Virtual Store - ${product.title}`} />

            <div className="container mx-auto py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="col-span-7">
                        <Carousel images={images} />
                    </div>

                    <div className="col-span-5">
                        <h1 className="mb-4 text-3xl font-bold">
                            {product.title}
                        </h1>

                        <div className="mb-4 text-2xl font-semibold text-gray-800">
                            <CurrencyFormatter
                                amount={selectedVariation.price}
                            />
                        </div>

                        {/* VARIANTS */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-600">
                                {selectedVariation.type}
                            </h3>
                            <p className="mb-2 font-semibold text-gray-400">
                                {selectedVariation.name}
                            </p>
                            <div className="flex gap-3">
                                {product.variations.map((v) => {
                                    const main =
                                        v.images.find((img) => img.is_main) ??
                                        v.images[0];
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() =>
                                                handleVariationChange(v)
                                            }
                                            className={`rounded-lg border p-1 ${
                                                selectedVariation.id === v.id
                                                    ? 'border-blue-500'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={main.thumbnail}
                                                className="h-16 w-16 rounded object-cover"
                                                alt={v.name}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* QUANTITY */}
                        <div className="mb-4">
                            <label className="mb-1 block font-medium">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={selectedVariation.quantity}
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        Math.min(
                                            Number(e.target.value),
                                            selectedVariation.quantity,
                                        ),
                                    )
                                }
                                className="w-24 rounded border px-3 py-1"
                            />
                        </div>

                        {/* DISPONIBILIDAD */}
                        <p className="text-gray-500">
                            Disponibles: {selectedVariation.quantity} unidad
                            {selectedVariation.quantity !== 1 ? 'es' : ''}
                        </p>
                        <div className="mt-6">
                            <BuyButton
                                onClick={() =>
                                    console.log(
                                        'Comprar',
                                        selectedVariation.id,
                                        quantity,
                                    )
                                }
                                disabled={selectedVariation.quantity === 0} // deshabilita si no hay stock
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
