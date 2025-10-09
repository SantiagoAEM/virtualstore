import React, { useEffect } from 'react'

import { Head, Link, usePage, } from '@inertiajs/react';
import { DataTable } from './data-table';
import { columns, Department } from './columns';
import { PackagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

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

interface Deparmentpagination{
  data:Department[];
  current_page: number;
  last_page: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  path: string;
}

interface PageProps {
  flash?: {
    success?: string;
    error?: string;
  };
  [key: string]: unknown; 
}

export default function Index({departments}:{departments:Deparmentpagination}) {
const { props } = usePage<PageProps>();

  useEffect(() => {
    if (props.flash?.success) {
      toast(props.flash.success);
    }
  }, [props.flash?.success]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div>
      <Head title="Department" />
<Toaster />
    deparment
    <div className="container mx-auto p-3">
      <Link href='/department/create'>
        <Button  size="sm">
          <PackagePlus /> New department
        </Button>
      </Link>
      <DataTable 
        columns={columns} 
        data={departments.data} 
        nextpageurl={departments.next_page_url}
        prevpageurl={departments.prev_page_url}
        currentPage={departments.current_page}
        lastPage={departments.last_page}
        basePath={departments.path}
      />
    </div>

    </div>
</AppLayout>
  )
}
