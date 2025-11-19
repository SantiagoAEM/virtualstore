import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Pencil, Trash,  } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ConfirmDelete from './ui/confirm-delete';
import { Input } from './ui/input';


export interface ProductVariationFormData {
    id: number;
    name: string;
    type: 'color' | 'size' | 'style' | 'type';
    code?: string | null;
    price?: number | null;
    quantity?: number | null;
    images?: string[];
}

interface Props {
    productId: number;
    variations: ProductVariationFormData[];
}

export const variationSchema = z.object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    type: z.enum(['color', 'size', 'style', 'type']),
    code: z.string().optional(),
    price: z.coerce.number().nonnegative(),
    quantity: z.coerce.number().nonnegative(),
});

export type VariationFormData = z.output<typeof variationSchema> & {
    price: number;
    quantity: number;
};

export default function ProductVariationForm({ productId, variations }: Props) {
        
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVariation, setSelectedVariation] =
        useState<ProductVariationFormData | null>(null);
    const [editingVariation, setEditingVariation] =
        useState<ProductVariationFormData | null>(null);

    const form = useForm({
        resolver: zodResolver(variationSchema),
        defaultValues: {
            name: '',
            type: 'color' as const,
            code: '',
            price: 0,
            quantity: 0,
        },
    });

    // Cargar datos en el formulario para editar
    function handleEditClick(variation: ProductVariationFormData) {
        setEditingVariation(variation);
        form.reset({
            name: variation.name,
            type: variation.type,
            code: variation.code || '',
            price: variation.price || 0,
            quantity: variation.quantity || 0,
        });
    }

    // Cancelar edición
    function handleCancelEdit() {
        setEditingVariation(null);
        form.reset({
            name: '',
            type: 'color',
            code: '',
            price: 0,
            quantity: 0,
        });
    }

    // Guardar cambios (crear o actualizar)
    function handleSubmit(values: VariationFormData) {
        setLoading(true);

        if (editingVariation) {
            // Actualizar 
            router.put(`/products/variations/${editingVariation.id}`, values, {
                onSuccess: () => {
                    setLoading(false);
                    handleCancelEdit();
                },
                onError: (errors) => {
                    setLoading(false);
                    Object.entries(errors).forEach(([key, value]) => {
                        form.setError(key as keyof VariationFormData, {
                            message: value as string,
                        });
                    });
                },
            });
        } else {
            // Crear 
            router.post(`/products/${productId}/variations`, values, {
                onSuccess: () => {
                    setLoading(false);
                    form.reset();
                },
                onError: (errors) => {
                    setLoading(false);
                    Object.entries(errors).forEach(([key, value]) => {
                        form.setError(key as keyof VariationFormData, {
                            message: value as string,
                        });
                    });
                },
            });
        }
    }

    const handleConfirmDelete = () => {
        if (!selectedVariation) return;

        router.delete(`/products/variations/${selectedVariation.id}`, {
            onSuccess: () => {
                console.log('Variación eliminada correctamente');
            },
            onError: () => {
                console.log('Error al eliminar variación');
            },
        });

        setOpenDialog(false);
    };

    return (
        <div className="space-y-4">
            <ConfirmDelete
                onConfirm={handleConfirmDelete}
                title="¿Eliminar variación?"
                description={`Esto eliminará "${selectedVariation?.name ?? ''}" y sus imágenes asociadas.`}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="grid grid-cols-4 items-end gap-4"
                >
                    {/* Nombre */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: Rojo, XL, Casual"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tipo */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="color">
                                            Color
                                        </SelectItem>
                                        <SelectItem value="size">
                                            Tamaño
                                        </SelectItem>
                                        <SelectItem value="style">
                                            Estilo
                                        </SelectItem>
                                        <SelectItem value="type">
                                            Tipo
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Código (solo para color) */}
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código</FormLabel>
                                <FormControl>
                                    <Input
                                        type={
                                            form.watch('type') === 'color'
                                                ? 'color'
                                                : 'text'
                                        }
                                        disabled={
                                            form.watch('type') !== 'color'
                                        }
                                        {...field}
                                        className="w-20"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Precio */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        value={field.value as number | string}
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value) || 0,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Cantidad */}
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cantidad</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        value={field.value as number | string}
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value) || 0,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="col-span-1 flex gap-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading
                                ? 'Trabajando...'
                                : editingVariation
                                  ? 'Actualizar'
                                  : 'Agregar'}
                        </Button>
                        {editingVariation && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancelEdit}
                                disabled={loading}
                            >Cancel
                               
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            {/* Lista de variaciones */}
            <div className="grid grid-cols-2 gap-4">
                {variations.map((v) => (
                    <div
                        key={v.id}
                        className={`flex items-center justify-between rounded-md border p-3 ${
                            editingVariation?.id === v.id
                                ? 'border-blue-500 bg-blue-50'
                                : ''
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {v.type === 'color' && (
                                <div
                                    className="h-6 w-6 rounded-full border"
                                    style={{
                                        backgroundColor: v.code || '#000',
                                    }}
                                ></div>
                            )}
                            <div>
                                <p className="font-medium">{v.name}</p>
                                <p className="text-xs text-gray-500">
                                    Tipo: {v.type} | Precio: ${v.price ?? 0} |
                                    Cant: {v.quantity ?? 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditClick(v)}
                                disabled={editingVariation?.id === v.id}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                    setSelectedVariation(v);
                                    setOpenDialog(true);
                                }}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}