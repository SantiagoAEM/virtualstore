import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from './ui/input';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDelete from './ui/confirm-delete';
import { Trash } from 'lucide-react';


interface ProductColor {
  id: number;
    color_name: string;
    color_code: string;
}
interface Props {
  productId: number;
  colors: ProductColor[];
}
export const colorSchema = z.object({
  color_name: z.string().min(3, 'El nombre es obligatorio y debe tener al menos 3 caracteres'),
  color_code: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Debe ser un color hexadecimal válido (#rrggbb)'),
})

export type ColorFormData = z.infer<typeof colorSchema>

export default function ProductColorForm({ productId, colors }: Props) {
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

    const form = useForm<ColorFormData>({
        resolver: zodResolver(colorSchema),
        defaultValues: {
        color_name: '',
        color_code: '#000000',        
    },
  });

    function handleAddColor(values: ColorFormData) {
    setLoading(true);
    router.post(`/products/${productId}/colors`, values, {
      onSuccess: () => {
        setLoading(false);
        form.reset(); 
      },
      onError: (errors) => {
        setLoading(false);
        Object.entries(errors).forEach(([key, value]) => {
          form.setError(key as keyof ColorFormData, {
            message: value as string,
          });
        });
      },
    });
  }
    const handleConfirmDelete = () => {
        if (!selectedColor) return;

        router.delete(`/products/product-colors/${selectedColor.id}`, {
        onSuccess: () => {
            console.log('Color eliminado correctamente');
        },
        onError: () => {
            console.log('Error al eliminar color');
        },
        });

        setOpenDialog(false);
    };

 return (
    
    <div className="space-y-4">
         <ConfirmDelete
                onConfirm={handleConfirmDelete}
                title="¿Delete color?"
                description={`This action will delete color " 
                    ${selectedColor?.color_name ?? ''}
                     " and all images realated to.`}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}      
              />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddColor)} className="flex items-center gap-4">
                      

                        <FormField
                            control={form.control}
                            name="color_name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel></FormLabel>
                                <FormControl>
                                <Input placeholder="Product Color" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                            <FormField
                            control={form.control}
                            name="color_code"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel></FormLabel>
                                <FormControl>
                                <Input type="color" 
                                       className="w-14 auto "
                                       {...field} 
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                        <Button 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? "Working..." : "Add color"}
                        </Button>
            </form>        
        </Form>

  <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <div
            key={color.id}
            className="border p-2 rounded-md flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color.color_code }}
              ></div>
              <span>{color.color_name}</span>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => {
                setSelectedColor(color);
                setOpenDialog(true);
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>    
    </div>
  );
}
