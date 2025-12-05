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
import DepartmentController from "@/actions/App/Http/Controllers/Admin/DepartmentController"


export type Department = {
  id: number
  name: string
  slug: string
  meta_title: string
  meta_description: string
  active:boolean
}

function DepartmentActions({ departmentItem }: { departmentItem: Department }) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirmDelete = () => {
    router.delete(DepartmentController.destroy(departmentItem.id), {
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
          <Link href={DepartmentController.edit.url(departmentItem.id)}>
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
        description={`Esta acción eliminará el departamento "${departmentItem.name}".`}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}      
      />
    </>
  )
}

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "meta_title",
    header: "Meta title",
  },
  {
    accessorKey: "meta_description",
    header: "Meta description",
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
    cell: ({ row }) => <DepartmentActions departmentItem={row.original} />,
  },
]
