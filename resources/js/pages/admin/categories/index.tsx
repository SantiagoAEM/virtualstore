import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PackagePlus } from 'lucide-react';
import { DataTable } from '../department/data-table';
import { columns, Category } from './columns';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
        {
        title: 'Categories',
        href: '/categories',
        
    },
];

export default function index({ categories }: { categories: Category[] }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories" />
       <div className="container mx-auto p-3">
          <Link href='/categories/create'>
            <Button  size="sm">
              <PackagePlus /> New category
            </Button>
          </Link>
          <DataTable 
                  columns={columns} 
                  data={categories} 
                />
       </div>
    </AppLayout>
  )
}
