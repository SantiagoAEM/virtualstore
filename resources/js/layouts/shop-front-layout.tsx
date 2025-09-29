import ShopFooter from '@/components/ShopFooter'
import ShopHeader from '@/components/ShopHeader'
import React, { ReactNode } from 'react'


export default function ShopFrontLayout({children}:{children:ReactNode}) {
  return (
    <div>
        <ShopHeader/>
            {children}
        <ShopFooter/>
    </div>
  )
}
