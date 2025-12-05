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
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import TiptapEditor from '@/components/tiptap-editor';
import { Input } from '@/components/ui/input';
import { useSlugGenerator } from '@/hooks/slugAutomatico';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Products',
        href: ProductController.index().url,
    },
    {
        title: 'Product create',
        href: '/products/create',
    },
];

interface Category {
    id: number;
    name: string;
    department_id: number;
}
interface Department {
    id: number;
    name: string;
}

export const productSchema = z.object({
    title: z
        .string()
        .min(3, 'El nombre es obligatorio y debe tener al menos 3 caracteres'),
    slug: z.string().readonly(),
    category_id: z.number().nonnegative().optional(),
    department_id: z.number(),
    description: z.string().min(3, 'Description is required'),
    price: z.number().nonnegative(),
    quantity: z.number().nonnegative(),
    status: z.enum(['draft', 'published']),
});

export type ProductFormData = z.infer<typeof productSchema>;

export default function Create({
    categories,
    departments,
}: {
    categories: Category[];
    departments: Department[];
}) {
    function onSubmit(values: ProductFormData) {
        router.post(ProductController.store(), values, {
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

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: '',
            slug: '',
            description: '',
            department_id: 0,
            category_id: 0,
            price: 0,
            quantity: 0,
            status: 'published',
        },
    });

    const selectedDepartmentId = form.watch('department_id');
    const filteredCategories = categories.filter(
        (category) => category.department_id === selectedDepartmentId,
    );

    useSlugGenerator(form, 'title', 'slug');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product create" />
            <div className="container mx-auto p-3">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product title</FormLabel>
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
                                        <FormLabel>Department</FormLabel>
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
                                                    Department is not selected
                                                </SelectItem>
                                                {departments.map(
                                                    (department) => (
                                                        <SelectItem
                                                            key={department.id}
                                                            value={department.id.toString()}
                                                        >
                                                            {department.name}
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
                                                    Category is not selected
                                                </SelectItem>
                                                {filteredCategories.map(
                                                    (category) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={category.id.toString()}
                                                        >
                                                            {category.name}
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

                        {/*  Tiptap*/}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>

                                    <TiptapEditor
                                        value={field.value}
                                        onChange={(html) =>
                                            form.setValue('description', html)
                                        }
                                        error={fieldState.error?.message}
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
                                                value={field.value}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
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
                                                value={field.value}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
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
                                                field.value === 'published'
                                            }
                                            onCheckedChange={(checked) =>
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
        </AppLayout>
    );
}
