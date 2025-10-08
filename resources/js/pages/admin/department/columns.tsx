"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@inertiajs/react";
import department from "@/routes/department";


export type Department = {
  id: number,
  name: string,
  slug: string,
  meta_title:string,
  meta_description:string,
}



export const columns: ColumnDef<Department>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
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
    id: "actions",
    cell: ({ row }) => {
      const deparments = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
             
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
           <Link href={department.edit.url(deparments.id)} title='Edit'> <DropdownMenuItem>Edit</DropdownMenuItem></Link>
            <DropdownMenuItem>
              <form method="post" action={department.destroy.form(deparments.id).action}>
                <input type="hidden" name="_method" value="DELETE" />
                <button type="submit">Delete</button>
                
                </form>
                
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]