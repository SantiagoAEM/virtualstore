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



interface Categorypagination{
  data:Category[];
  current_page: number;
  last_page: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  path: string;
}

export default function index({categories}:{categories:Categorypagination}) {
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
                  data={categories.data} 
                  prevpageurl={categories.prev_page_url}
                  nextpageurl={categories.next_page_url}
                  currentPage={categories.current_page}
                  lastPage={categories.last_page}
                  basePath={categories.path}
                />
       </div>
    </AppLayout>
  )
}
