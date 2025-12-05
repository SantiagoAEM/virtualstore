import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PackagePlus } from 'lucide-react';
import { DataTable } from '../department/data-table';
import { columns, Category } from './columns';
import { Toaster } from '@/components/ui/sonner';
import { useFlashToast } from '@/hooks/UseFlashToast';
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
];



export default function Index({ categories }: { categories: Category[] }) {
useFlashToast();
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories" />
       <div className="container mx-auto p-3">
          <Link href={CategoryController.create().url} >
            <Button  size="sm">
              <PackagePlus /> New category
            </Button>
          </Link>
          <DataTable 
                  columns={columns} 
                  data={categories} 
                />
       </div>
       <Toaster/>
    </AppLayout>
  )
}
