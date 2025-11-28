import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';


type BuyButtonProps = {
  onClick?: () => void;
  disabled?: boolean; // <- agregamos esta prop
};

export default function BuyButton({ onClick, disabled = false }: BuyButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-rose-600 hover:bg-rose-600/70 transition
        text-white 
        rounded-full 
        w-12 h-12 
        flex items-center justify-center
        shadow-lg
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <ShoppingCart className="w-4 h-4" />    
    </Button>
  );
}