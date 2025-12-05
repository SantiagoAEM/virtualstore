import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react'
import { Category } from './columns';
import { Department } from '../department/columns';
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
import CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Categorias',
        href: CategoryController.index().url,
    },
    {
        title: 'Editar categoria',
        href: '#',
    },
];


export const categorySchema = z.object({
  name: z.string().min(3, 'Name  is requiered and  at least 3 characters long'),
  parent_id: z.number().nonnegative().optional(),
  department_id: z.number(),
  active: z.boolean(),
})
export type CategoryFormData = z.infer<typeof categorySchema>

interface EditProps {
  category: Category;
  categories: Category[];
  departments: Department[];
}

export default function Edit({ category, categories, departments }: EditProps) {
function onSubmit(values: CategoryFormData) {
    router.put(CategoryController.update(category.id), values, {
     preserveScroll: true,
      onSuccess: () => {
      },
      onError: (errors) => {
        // Pasa los errores al hook de react-hook-form
        Object.entries(errors).forEach(([key, value]) => {
          form.setError(key as keyof CategoryFormData, {
            message: value as string,
          });
        });
      },
    });
  }

     const form = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
        name: category?.name || '',
        department_id: category?.department_id || 0,
        parent_id: category?.parent_id || 0,
        active: category?.active ?? false,
        
    },
  });
 
  return (

    <AppLayout breadcrumbs={breadcrumbs}>
    <Head title="Editar categoria" />

    <div className="container mx-auto p-3">
            <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category name</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Sweeter" {...field} />
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
            name="parent_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent category (optional)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "0" ? null : Number(value))}
                  defaultValue={field.value != null ? field.value.toString() : "0"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Parent not selected</SelectItem>
                    {categories.map((category) => (
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

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      id="active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor="active">Active</FormLabel>
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
