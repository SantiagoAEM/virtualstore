import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';


type BuyButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string; 
};

export default function BuyButton({ onClick, disabled = false, tooltip }: BuyButtonProps) {
  return (
    <div className="relative group">
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

      {/* Tooltip */}
      {disabled && tooltip && (
        <span className="
          transform -translate-x-1/2
          bg-gray-800 text-white text-xs rounded py-1 px-2
          opacity-0 group-hover:opacity-100 transition-opacity
          whitespace-nowrap
        ">
          {tooltip}
        </span>
      )}
    </div>
  );
}
