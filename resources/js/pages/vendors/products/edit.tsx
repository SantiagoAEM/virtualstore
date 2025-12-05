import ProductGallery, {
    VariationWithImages,
} from '@/components/ProductGallery';
import ImageUploadForm from '@/components/image-upload-form';
import ProductVariationForm from '@/components/product-variation-form';
import TiptapEditor from '@/components/tiptap-editor';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { useFlashToast } from '@/hooks/UseFlashToast';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/pages/admin/categories/columns';
import { Department } from '@/pages/admin/department/columns';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Product } from './columns';
import ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Productos',
        href: ProductController.index().url,
    },
    {
        title: 'Editar producto',
        href: '#',
    },
];

interface EditProps {
    categories: Category[];
    departments: Department[];
    product: Product & { variations: VariationWithImages[] };
}

export const productSchema = z.object({
    title: z
        .string()
        .min(3, 'El nombre es obligatorio y debe tener al menos 3 caracteres'),
    slug: z.string().readonly(),
    category_id: z.coerce.number().nonnegative().optional(),
    department_id: z.coerce.number(),
    description: z.string().min(3, 'Description is required'),
    price: z.coerce.number().nonnegative(),
    quantity: z.coerce.number().nonnegative(),
    status: z.enum(['draft', 'published']),
});

export type ProductFormData = z.output<typeof productSchema> & {
    price: number;
    quantity: number;
};

export default function Edit({ product, categories, departments }: EditProps) {
    useFlashToast();
    const [selectedVariationId, setSelectedVariationId] = useState<
        number | null
    >(null);

    function onSubmit(values: ProductFormData) {
        router.put(ProductController.update(product.id), values, {
            preserveScroll: true,
            onSuccess: () => {},
            onError: (errors) => {
                // Puede pasar los errores al hook de react-hook-form
                Object.entries(errors).forEach(([key, value]) => {
                    form.setError(key as keyof ProductFormData, {
                        message: value as string,
                    });
                });
            },
        });
    }

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: product?.title || '',
            slug: product?.slug || '',
            description: product?.description || '',
            department_id: product?.department?.id || 0,
            category_id: product?.category?.id || 0,
            price: product?.price || 0,
            quantity: product?.quantity || 0,
            status: product?.status || 'draft',
        },
    });

    const selectedDepartmentId = form.watch('department_id');
    const filteredCategories = categories.filter(
        (category) => category.department_id === selectedDepartmentId,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product edit" />
            <div className="container mx-auto space-y-6 p-2">
                <div className="mt-8 space-y-8">
                    {/* --- Variant section --- */}
                    <div>
                        <h2 className="mb-3 text-xl font-semibold">
                            Product Variants
                        </h2>

                        <ProductVariationForm
                            productId={product.id}
                            variations={product.variations.map((v) => ({
                                id: v.id,
                                name: v.name,
                                type: v.type,
                                code: v.code,
                                price: v.price,
                                quantity: v.quantity,
                                images: v.images.map((img) => img.path),
                            }))}
                        />

                        {/* --- Gallery--- */}
                        {product.variations && product.variations.length > 0 ? (
                            <div>
                                <h2 className="mb-3 text-xl font-semibold">
                                    Variant Options
                                </h2>
                                <ProductGallery
                                    variations={product.variations}
                                    onSelectVariation={(id) =>
                                        setSelectedVariationId(id)
                                    }
                                />
                                {/* Mostrar solo el formulario del variant seleccionado */}
                                {selectedVariationId ? (
                                    (() => {
                                        const variation =
                                            product.variations.find(
                                                (v) =>
                                                    v.id ===
                                                    selectedVariationId,
                                            );
                                        if (!variation) return null;

                                        return (
                                            <div className="mt-6 rounded-md border p-4">
                                                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                                    Subir imagenes de:{' '}
                                                </h3>
                                                <p className="font-medium text-gray-700">
                                                    {variation.name}(
                                                    {variation.type})
                                                </p>

                                                <ImageUploadForm
                                                    variationId={variation.id}
                                                />
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <p className="text-yellow-600">
                                        Select a variation option above to
                                        upload its images.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                ⚠️ This product does not have any variation. Add
                                a new one before uploading images.
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6 p-2"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Product title
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ej: Polo sweeter"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="department_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Department
                                                </FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(
                                                            value === '0'
                                                                ? null
                                                                : Number(value),
                                                        )
                                                    }
                                                    defaultValue={
                                                        field.value != null
                                                            ? field.value.toString()
                                                            : '0'
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select department" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">
                                                            Department is not
                                                            selected
                                                        </SelectItem>
                                                        {departments.map(
                                                            (department) => (
                                                                <SelectItem
                                                                    key={
                                                                        department.id
                                                                    }
                                                                    value={department.id.toString()}
                                                                >
                                                                    {
                                                                        department.name
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select
                                                    onValueChange={(value) =>
                                                        field.onChange(
                                                            value === '0'
                                                                ? null
                                                                : Number(value),
                                                        )
                                                    }
                                                    defaultValue={
                                                        field.value != null
                                                            ? field.value.toString()
                                                            : '0'
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">
                                                            Category is not
                                                            selected
                                                        </SelectItem>
                                                        {filteredCategories.map(
                                                            (category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={category.id.toString()}
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/*  Tiptap  */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>

                                            <TiptapEditor
                                                value={field.value}
                                                onChange={(html) =>
                                                    form.setValue(
                                                        'description',
                                                        html,
                                                    )
                                                }
                                                error={
                                                    fieldState.error?.message
                                                }
                                            />

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        value={
                                                            field.value as
                                                                | number
                                                                | string
                                                        }
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ) || 0,
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        value={
                                                            field.value as
                                                                | number
                                                                | string
                                                        }
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Switch
                                                    id="status"
                                                    checked={
                                                        field.value ===
                                                        'published'
                                                    }
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        field.onChange(
                                                            checked
                                                                ? 'published'
                                                                : 'draft',
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormLabel htmlFor="status">
                                                Published
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit">Save</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            <Toaster />
        </AppLayout>
    );
}
