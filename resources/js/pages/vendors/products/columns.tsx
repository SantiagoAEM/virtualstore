"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, router } from "@inertiajs/react"
import ConfirmDelete from "@/components/ui/confirm-delete"
import products from "@/routes/products"

export type Product = {
  id: number
  title: string
  slug: string
  description: string
  department_id:number
  category_id: number
  price: number
  status: "draft" | "published"
  quantity: number
  created_by: number
  updated_by: number
  department?: {
    id: number
    name: string
  }
   category?: {
    id: number
    name: string
  }
}

function ProductActions({ productItem }: { productItem: Product }) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirmDelete = () => {
    router.delete(`/products/${productItem.id}`, {
      onSuccess: () => {
        console.log("Eliminado");
      },
      onError: () => {
        console.log("Error al eliminar");
      },
    });
  setOpenDialog(false);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={products.edit.url(productItem.id)}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
        <DropdownMenuItem onClick={() => setOpenDialog(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDelete
        onConfirm={handleConfirmDelete}
        title="¿Eliminar departamento?"
        description={`Esta acción eliminará el departamento "${productItem.title}".`}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}      
      />
    </>
  )
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell:({row}) =>(
    <div className="max-w-[200px] truncate" title={row.original.title}>
      {row.original.title}
    </div>
  ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell:({row}) =>(
      <div className="max-w-[200px] truncate" title={row.original.slug}>
        {row.original.slug}
      </div>
    )
  },
  {
    accessorKey: "department_id",
    header: "Department",
    cell: ({ row }) => (
      row.original.department
        ? row.original.department.name
        : <span className="text-gray-300 italic">N/A</span>
    ),
  },
  {
    accessorKey: "category_id",
    header: "Category",
  cell: ({ row }) => (
      row.original.category
        ? row.original.category.name
        : <span className="text-gray-400 italic">None</span>
    ),
  },
  {
    accessorKey: "description",
      header: "Description",
  cell: ({ row }) => (
    <div className="max-w-[250px] truncate" title={row.original.description}>
      {row.original.description}
    </div>
  ),
  },
    {
    accessorKey: "price",
    header: "Price",
  },
    {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      row.original.status === "published"
        ? <span className="text-green-600 font-semibold">Published</span>
        : <span className="text-gray-700 font-semibold">Draft</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActions productItem={row.original} />,
  },
]
