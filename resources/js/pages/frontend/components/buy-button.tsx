import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import React from 'react'

type BuyButtonProps = {
    onClick?: () => void;
};

export default function BuyButton({ onClick }: BuyButtonProps) {
  return (
     <Button
            onClick={onClick}
             className="
        bg-rose-600 hover:bg-rose-600/70 transition
        text-white 
        rounded-full 
        w-12 h-12 
        flex items-center justify-center
        shadow-lg
        cursor-pointer
        "
        >
       <ShoppingCart className="w-4 h-4" />    
        </Button>
  )
}
