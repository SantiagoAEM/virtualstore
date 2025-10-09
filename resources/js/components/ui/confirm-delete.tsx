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
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
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
          <AlertDialogCancel onClick={() => setOpenDialog(false)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              setOpenDialog(false);
            }}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}