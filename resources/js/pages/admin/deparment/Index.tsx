import React from 'react'

import { Head } from '@inertiajs/react';
import { DataTable } from './data-table';
import { columns, Department } from './columns';

interface Deparmentpagination{
  data:Department[];
  current_page: number;
  last_page: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  path: string;
}

export default function Index({deparments}:{deparments:Deparmentpagination}) {
  return (
    <div>
      <Head title="Department" />

    deparment
    <div className="container mx-auto p-3">
      <DataTable 
        columns={columns} 
        data={deparments.data} 
        nextpageurl={deparments.next_page_url}
        prevpageurl={deparments.prev_page_url}
        currentPage={deparments.current_page}
        lastPage={deparments.last_page}
        basePath={deparments.path}
      />
    </div>

    </div>

  )
}
