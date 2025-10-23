import { Head, Link } from '@inertiajs/react';
import { DataTable } from './data-table';
import { columns, Department } from './columns';
import { PackagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Toaster } from '@/components/ui/sonner';
import { useFlashToast } from '@/hooks/UseFlashToast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
        {
        title: 'Department',
        href: '/department',
        
    },
];

export default function Index({ departments }: { departments: Department[] }) {
useFlashToast();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div>
      <Head title="Department" />

    <div className="container mx-auto p-3">
      <Link href='/department/create'>
        <Button  size="sm">
          <PackagePlus /> New department
        </Button>
      </Link>
      <DataTable 
        columns={columns} 
        data={departments}
      />
    </div>

    </div>
    <Toaster />
</AppLayout>
  )
}
