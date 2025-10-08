import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import React from 'react'
import { DepartmentFormData } from './create'
import { useForm } from 'react-hook-form'
import { Department } from './columns'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

export const departmentSchema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio y debe tener al menos 3 caracteres'),
  slug: z.string().min(1, 'El slug es obligatorio'),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
})

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
        title: 'Department edit',
        href: '/deparment/edit',
    },
];


export default function Edit({department}:{department:Department}) {



const form = useForm<DepartmentFormData>({
   resolver: zodResolver(departmentSchema),
      defaultValues: {
      name: department?.name || '',
      slug: department?.slug || '',
      meta_title: department?.meta_title || '',
      meta_description: department?.meta_description || '',
    },
  });
const onSubmit = (data: DepartmentFormData) => {
    router.put(`/department/${department.id}`, data, {
      preserveScroll: true,
      onSuccess: () => {
        // puedes mostrar un toast o redirigir
        console.log("Actualizado correctamente")
      },
      onError: (errors) => {
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
      <Head title="Department edit" />

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

          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
    </AppLayout>
  )
}
