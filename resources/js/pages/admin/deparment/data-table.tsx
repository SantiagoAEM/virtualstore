"use client"
import { Button } from "@/components/ui/button"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { router } from "@inertiajs/react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  nextpageurl: string | null | undefined;
  prevpageurl: string | null | undefined;
  currentPage: number;
  lastPage: number;
  basePath: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  nextpageurl,
  prevpageurl,
  basePath,
  lastPage,
  currentPage,

}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

  })

  return (
   <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div> 
   <div className="flex items-center justify-end space-x-2 py-4 flex-wrap">
  <Button
    variant="outline"
    size="sm"
    onClick={() => prevpageurl ? router.visit(prevpageurl) : null}
    disabled={!prevpageurl}
  >
    Previous
  </Button>

  {/* Números de página */}
  {Array.from({ length: lastPage }, (_, index) => {
    const page = index + 1;
    const pageUrl = `${basePath}?page=${page}`;

    return (
      <Button
        key={page}
        variant={currentPage === page ? "default" : "outline"}
        size="sm"
        onClick={() => router.visit(pageUrl)}
      >
        {page}
      </Button>
    );
  })}

  <Button
    variant="outline"
    size="sm"
    onClick={() => nextpageurl ? router.visit(nextpageurl) : null}
    disabled={!nextpageurl}
  >
    Next
  </Button>
</div>
    </div>
  )
}