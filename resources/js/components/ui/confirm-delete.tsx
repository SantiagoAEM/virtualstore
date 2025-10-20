import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog";


interface ConfirmDeleteProps {
  title?: string;
  description?: string;
  onConfirm: () => void;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

export default function ConfirmDelete({
  title = "",
  description = "",
  onConfirm,
  openDialog,
  setOpenDialog,
}: ConfirmDeleteProps) {
  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpenDialog(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction  
            onClick={() => {
              onConfirm();
              setOpenDialog(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}