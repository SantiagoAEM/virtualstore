import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Switch } from '@/components/ui/switch';

import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout'
import { Head, router } from '@inertiajs/react';
import { Textarea } from "@/components/ui/textarea";
import { Product } from "./columns";
import { Category } from "@/pages/admin/categories/columns";
import { Department } from "@/pages/admin/department/columns";



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Products',
        href: '/products',
    },
     {
        title: 'Product create',
        href: '/products/create',
    },
];

interface EditProps {
  categories: Category[];
  departments: Department[];
  product:Product;
}



export const productSchema = z.object({
  title: z.string().min(3, 'El nombre es obligatorio y debe tener al menos 3 caracteres'),
  slug: z.string().readonly(),
  category_id: z.coerce.number().nonnegative().optional(),
  department_id: z.coerce.number(),
  description: z.string().min(3, 'Description is required'),
  price: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().nonnegative(),
  status: z.enum(['draft', 'published']),
});

export type ProductFormData = z.output<typeof productSchema> & {
  price: number
  quantity: number
}

export default function Edit({product, categories, departments }: EditProps) {

function onSubmit(values: ProductFormData) {
    router.put(`/products/${product.id}`, values, {
     preserveScroll: true,
      onSuccess: () => {
      
      },
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
        slug: product?.slug||'',
        description: product?.description ||'',
        department_id:product?.department?.id||0,
        category_id: product?.category?.id || 0,
        price: product?.price || 0,
        quantity: product?.quantity || 0,
        status: product?.status || 'draft',
        
    },
  });


  const selectedDepartmentId = form.watch('department_id');
  const filteredCategories = categories.filter(
  (category) => category.department_id === selectedDepartmentId
);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Product create" />
        <div className="container mx-auto p-3">
            <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product title</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Polo sweeter" {...field} />
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
                    <Input  {...field} />
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
                    onValueChange={(value) => field.onChange(value === "0" ? null : Number(value))}
                    defaultValue={field.value != null ? field.value.toString() : "0"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Department is not selected</SelectItem>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
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
                  onValueChange={(value) => field.onChange(value === "0" ? null : Number(value))}
                  defaultValue={field.value != null ? field.value.toString() : "0"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Category is not selected</SelectItem>
                    {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                  <Textarea
                    id="description"
                    placeholder="Describe a product"
                    className="min-h-[100px] resize-none sm:min-w-[300px]"
                    {...field}
                  ></Textarea>
                  </FormControl>
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
                    <Input  type="number"
                      value={field.value  as number | string}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
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
                    <Input  type="number"
                      value={field.value  as number | string}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      checked={field.value === 'published'}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? 'published' : 'draft')
                      }
                    />
                  </FormControl>
                  <FormLabel htmlFor="status">Published</FormLabel>
                </FormItem>
              )}
            />


          <Button type="submit">Save</Button>
        </form>
      </Form>
        </div>
    
    </AppLayout>
  )
}
