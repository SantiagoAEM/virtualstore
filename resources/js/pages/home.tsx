import ShopFrontLayout from '@/layouts/shop-front-layout'
import ShopBanner from './frontend/ShopBanner'
import { PaginationProps, Product } from '@/types'
import ProductItem from './frontend/components/product-item'

export default function home({products}:{products:PaginationProps<Product>}) {
  return (
    <ShopFrontLayout>
        <div className="min-h-screen">
          <h2>welcome to Vlosthing store</h2>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.data.map((product)=>(
                <ProductItem product={product} key={product.id} />
              ))}
            </div>
          </div>
          <ShopBanner />
        </div>
    </ShopFrontLayout>
  )
}
