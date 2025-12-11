import ProductResourceController from '@/actions/App/Http/Controllers/Frontend/ProductResourceController';
import Carousel from '@/components/carousel';
import ShopFrontLayout from '@/layouts/shop-front-layout';
import { BreadcrumbItem, Product, ProductVariation } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import BuyButton from '../components/buy-button';
import CurrencyFormatter from '../components/currency-formatter';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: ProductResourceController.home.url(),
    },
    {
        title: 'Detalles del producto',
        href: '#',
    },
];

type Props = {
    product: Product;
    activeVariationSlug?: string;
};

export default function Show() {
    const { product, activeVariationSlug } = usePage()
        .props as unknown as Props;

    // INIT VARIATION-----------------------------------------------------------
    const initialVariation = useMemo(() => {
        return (
            product.variations.find((v) => v.slug === activeVariationSlug) ??
            product.variations[0]
        );
    }, [product, activeVariationSlug]);

    const [selectedVariation, setSelectedVariation] =
        useState<ProductVariation>(initialVariation);

    const [quantity, setQuantity] = useState<number>(1);

    // IMAGES -----------------------------------------------------------------
    const images = useMemo(() => {
        const main = selectedVariation.images.find((img) => img.is_main);
        const others = selectedVariation.images.filter((img) => !img.is_main);
        return main ? [main, ...others] : selectedVariation.images;
    }, [selectedVariation]);

    // HANDLE VARIATION----------------------------------------------------------
    function handleVariationChange(v: ProductVariation) {
        setSelectedVariation(v);
        setQuantity(1);

        router.visit(`/product/${product.slug}/v/${v.slug}`, {
            method: 'get',
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    }

    return (
        <div>
            <ShopFrontLayout breadcrumbs={breadcrumbs}>
                <Head title={`Virtual Store - ${product.title}`} />

                <div className="container mx-auto px-4 py-8 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* CAROUSEL ---------------------------------------------------------------------- */}
                        <div className="col-span-7">
                            <Carousel images={images} />
                        </div>

                        {/* PRODUCT INFO ---------------------------------------------------------------- */}
                        <div className="col-span-5">
                            <h1 className="mb-4 text-3xl font-bold">
                                {product.title}
                            </h1>

                            <div className="mb-4 text-2xl font-semibold text-gray-800">
                                <CurrencyFormatter
                                    amount={selectedVariation.price}
                                />
                            </div>

                            {/* VARIATIONS ------------------------------------------------------------------ */}
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
                                            v.images.find(
                                                (img) => img.is_main,
                                            ) ?? v.images[0];
                                        return (
                                            <button
                                                key={v.id}
                                                onClick={() =>
                                                    handleVariationChange(v)
                                                }
                                                className={`rounded-lg border p-1 transition ${
                                                    selectedVariation.id ===
                                                    v.id
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

                            {/* QUANTITY ------------------------------------------------------------------- */}
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

                            {/* STOCK ---------------------------------------------------------------------- */}
                            <p className="text-gray-500">
                                Disponibles: {selectedVariation.quantity} unidad
                                {selectedVariation.quantity !== 1 ? 'es' : ''}
                            </p>

                            {/* BUY BUTTON ----------------------------------------------------------------- */}
                            <div className="mt-6">
                                <BuyButton
                                    onClick={() =>
                                        console.log(
                                            'Comprar',
                                            selectedVariation.id,
                                        )
                                    }
                                    disabled={selectedVariation.quantity === 0}
                                    tooltip={
                                        selectedVariation.quantity === 0
                                            ? 'No stock'
                                            : undefined
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* DESCRIPTION ---------------------------------------------------------------------- */}
                    <div className="mt-12">
                        <h2 className="mb-3 text-xl font-semibold">
                            Acerca de este artículo:
                        </h2>
                        <div
                            className="prose max-w-none 
                            prose-slate lg:prose-lg dark:prose-invert 
                            prose-h3:mt-1 prose-h3:mb-1 prose-p:my-1 prose-ul:my-1"
                            dangerouslySetInnerHTML={{
                                __html: product.description,
                            }}
                        ></div>
                    </div>
                </div>
            </ShopFrontLayout>
        </div>
    );
}
