import ShopFrontLayout from '@/layouts/shop-front-layout';
import { PaginationProps, Product } from '@/types';
import ProductItem from './frontend/components/product-item';
import ShopBanner from './frontend/ShopBanner';

export default function home({
    products,
}: {
    products: PaginationProps<Product>;
}) {
    return (
        <ShopFrontLayout>
            <div className="mx-auto max-w-[1600px] px-4 py-10">
                <h2 className="mb-8 text-center text-3xl font-semibold">
                    Welcome to Tiendita virtual
                </h2>

                {/* PRODUCTS  ---------------------------------------------------------------- */}
                <div className="grid 
                  grid-cols-2
                  justify-items-center
                  gap-6 
                  sm:grid-cols-2 
                  md:grid-cols-3 
                  lg:grid-cols-4 
                  xl:grid-cols-5 
                  2xl:grid-cols-6"
                >
                    {products.data.map((product) => (
                        <ProductItem product={product} key={product.id} />
                    ))}
                </div>
            </div>
            <ShopBanner />
        </ShopFrontLayout>
    );
}
