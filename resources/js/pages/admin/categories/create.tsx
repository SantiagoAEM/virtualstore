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
import { Department } from "../department/columns";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Department',
        href: '/department',
    },
     {
        title: 'Department create',
        href: '/deparment/create',
    },
];

interface Category {
  id: number;
  name: string;
}



export const categorySchema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio y debe tener al menos 3 caracteres'),
  parent_id: z.number().nonnegative().optional(),
  department_id: z.coerce
    .number()
    .refine((val) => val > 0, {
      message: "Seleccione el departamento",
    }),
  active: z.boolean(),
})
export type CategoryFormData = z.infer<typeof categorySchema>

export default function Create({ categories, departments }: { categories: Category[], departments:Department[]}) {

function onSubmit(values: CategoryFormData) {
    router.post('/categories', values, {
      onSuccess: () => {
      
      },
      onError: (errors) => {
        // Puede pasar los errores al hook de react-hook-form
        Object.entries(errors).forEach(([key, value]) => {
          form.setError(key as keyof CategoryFormData, {
            message: value as string,
          });
        });
      },
    });
  }

    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
        name: '',
        department_id:0,
        parent_id: 0,
        active:true,
        
    },
  });
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Department create" />
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
                  <FormLabel htmlFor="active">Activo</FormLabel>
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
