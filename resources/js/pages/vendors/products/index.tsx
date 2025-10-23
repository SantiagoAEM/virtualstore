import { DataTable } from '@/components/data-table-pagination';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, Link} from '@inertiajs/react';
import { PackagePlus } from 'lucide-react';
import { columns, Product } from './columns';
import { useFlashToast } from '@/hooks/UseFlashToast';




const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
        {
        title: 'Products',
        href: '/vendors/products',
        
    },
];

interface ProductPagination{
  data:Product[];
  current_page: number;
  last_page: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  path: string;
}



export default function Index({products}:{products:ProductPagination}) {
useFlashToast();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Products" />
      
      <div className="container mx-auto p-3">
       <Link href='/products/create'>
        <Button  size="sm">
          <PackagePlus /> New product
        </Button>
      </Link>
      <DataTable 
        columns={columns} 
        data={products.data}
        nextpageurl={products.next_page_url}
        prevpageurl={products.prev_page_url}
        currentPage={products.current_page}
        lastPage={products.last_page}
        basePath={products.path}
      />
      </div>
      <Toaster />
    </AppLayout>
  )
}
