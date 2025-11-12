import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';



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

export default function Upload() {
     const { data, setData, post, progress } = useForm({
    image: null as File | null,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/products/uploadform', { forceFormData: true })
  }
  return (
     <AppLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto p-4">
            <h1>Subir imagen</h1>
             <form onSubmit={submit}>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
          />
          <button type="submit">Subir</button>
          {progress && <p>Subiendo: {progress.percentage}%</p>}
        </form>
      </div>
    </AppLayout>
  )
}
