import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import BuyButton from './buy-button';
import CurrencyFormatter from './currency-formatter';

export default function ProductItem({ product }: { product: Product }) {
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="relative">
                <Link href={`/product/${product.slug}`}>
                    <figure>
                        <img
                            src={product.image}
                            alt={product.title}
                            className="aspect-square w-full object-cover"
                        />
                    </figure>
                </Link>
                <div className="absolute right-3 bottom-3">
                    <BuyButton
                        onClick={() => console.log('Comprar', product.id)}
                    />
                </div>
            </div>
            <div className="card-body m-2">
                <h2 className="card-title line-clamp-2">{product.title}</h2>
                <p className="text-gray-500 line-clamp-1">
                    {/*Falta construir la pagina de detalles del vendedor y de departamentos*/}
                    por{' '}
                    <Link href="/" className=" hover:underline">
                        {product.user.name}
                    </Link>
                    &nbsp; en{' '}
                    <Link href="/" className=" hover:underline">
                        {product.department.name}
                    </Link>
                </p>
                <div className="card-actions justify-right mt-2">
                    <span className="text-lg font-bold">
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
