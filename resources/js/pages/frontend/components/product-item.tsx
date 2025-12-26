import ProductResourceController from '@/actions/App/Http/Controllers/Frontend/ProductResourceController';
import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import BuyButton from './buy-button';
import CurrencyFormatter from './currency-formatter';

export default function ProductItem({ product }: { product: Product }) {
    return (
        <div
            className="
                w-full
                max-w-[180px]     
                sm:max-w-[200px] 
                md:max-w-[220px]  
                lg:max-w-[240px]  
                xl:max-w-[260px] 
                2xl:max-w-[280px] 
                overflow-hidden rounded-xl bg-white shadow-md
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
            "
        >
            <div className="group relative">
                <Link
                    href={ProductResourceController.show['/product/{product}'].url(product.slug)}
                >
                    <figure>
                        <img
                            src={product.image}
                            alt={product.title}
                            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </figure>
                </Link>
                <div className="absolute right-3 bottom-3 opacity-90 transition-opacity group-hover:opacity-100">
                    <BuyButton
                        onClick={() => console.log('Comprar', product.id)}
                    />
                </div>
            </div>

            <div className="p-4">
                <Link
                    href={ProductResourceController.show['/product/{product}'].url(product.slug)}
                >
                    <h2 className="line-clamp-2 text-lg font-semibold">
                        {product.title}
                    </h2>
                </Link>
                <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                    por{' '}
                    <Link href="/" className="text-gray-700 hover:underline">
                        {product.user.name}
                    </Link>{' '}
                    en{' '}
                    <Link href="/" className="text-gray-700 hover:underline">
                        {product.department.name}
                    </Link>
                </p>

                <div className="mt-3">
                    <span className="text-xl font-bold text-gray-900">
                        <CurrencyFormatter
                            amount={product.price}
                            currency="USD"
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}
