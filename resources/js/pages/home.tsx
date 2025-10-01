import ShopFrontLayout from '@/layouts/shop-front-layout'
import React from 'react'
import ShopBanner from './frontend/ShopBanner'

export default function home() {
  return (
    <ShopFrontLayout>
        <div className="min-h-screen">
          <h2>welcome to Vlosthing store</h2>
          <ShopBanner />
        </div>
    </ShopFrontLayout>
  )
}
