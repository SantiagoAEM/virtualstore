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
import categories from "@/routes/categories"
import { ChevronsUpDown } from "lucide-react"

export type Category = {
 id: number
  name: string
  department_id: number
  parent_id: number | null
  active: boolean
  children_count: number
  department?: {
    id: number
    name: string
  }
  parent?: {
    id: number
    name: string
  }
}

function DepartmentActions({ categoryItem }: { categoryItem: Category }) {

  const [openDialog, setOpenDialog] = useState(false);
  const isParentCategory = categoryItem.children_count > 0;

  const handleConfirmDelete = () => {
    router.delete(`/categories/${categoryItem.id}`, {
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
          <Link href={categories.edit.url(categoryItem.id)}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
        <DropdownMenuItem onClick={() => setOpenDialog(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
 <ConfirmDelete
        onConfirm={handleConfirmDelete}
        title={isParentCategory ? "¿You are trying to delete a parent category?" : "¿Delete category?"}
        description={
          isParentCategory
            ? `This is a parent category with subcategories related. This action will setup all the subcategories to null`
            : `This action will delete: "${categoryItem.name}".`
        }
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}      
      />
    </>
  )
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "department_id",
      header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      row.original.department
        ? row.original.department.name
        : <span className="text-gray-300 italic">N/A</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "parent_id",
      header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      row.original.parent
        ? row.original.parent.name
        : <span className="text-gray-400 italic">None</span>
    ),
  },
  {
    accessorKey: "active",
    header: "Published",
    cell: ({ row }) => (
      row.original.active
        ? <span className="text-green-600 font-semibold">Yes</span>
        : <span className="text-red-600 font-semibold">No</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DepartmentActions categoryItem={row.original} />,
  },
]