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
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, router, } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { useSlugGenerator } from '@/hooks/slugAutomatico';
import DepartmentController from '@/actions/App/Http/Controllers/Admin/DepartmentController';


export const departmentSchema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio y debe tener al menos 3 caracteres'),
  slug: z.string().min(1, 'El slug es obligatorio'),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  active: z.boolean(),
})

export type DepartmentFormData = z.infer<typeof departmentSchema>


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Department',
        href: DepartmentController.index().url,
    },
     {
        title: 'Department create',
        href: DepartmentController.create().url,
    },
];


export default function Create() {
  
     const form = useForm<DepartmentFormData>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
        name: '',
        slug: '',
        meta_title: '',
        meta_description: '',
        active:true,
        
    },
  });

 useSlugGenerator(form);


  function onSubmit(values: DepartmentFormData) {
    router.post(DepartmentController.store(), values, {
      onSuccess: () => {
      
      },
      onError: (errors) => {
        //  Pasa errores al hook de react-hook-form
        Object.entries(errors).forEach(([key, value]) => {
          form.setError(key as keyof DepartmentFormData, {
            message: value as string,
          });
        });
      },
    });
  }

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
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Department name" {...field} />
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
                  <Input placeholder="Ej: slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meta_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta título</FormLabel>
                <FormControl>
                  <Input placeholder="Títle for SEO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meta_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta description</FormLabel>
                <FormControl>
                  <Input placeholder="Description for SEO" {...field} />
                </FormControl>
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
