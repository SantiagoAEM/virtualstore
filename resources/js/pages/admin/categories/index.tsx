import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { PackagePlus } from 'lucide-react';
import { DataTable } from '../department/data-table';
import { columns, Category } from './columns';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { toast } from 'sonner';


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

interface PageProps {
  flash?: {
    success?: string;
    error?: string;
  };
  [key: string]: unknown; 
}

export default function Index({ categories }: { categories: Category[] }) {
  const { props } = usePage<PageProps>();

   useEffect(() => {
    if (props.flash?.success) {
      toast(props.flash.success);
    }
  }, [props.flash?.success]);
  
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
       <Toaster/>
    </AppLayout>
  )
}
