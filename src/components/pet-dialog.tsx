"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PetDialogProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  isFormOpen: boolean;
  setIsFormOpenAction: (open: boolean) => void;
}

export default function PetDialog({
  trigger,
  title,
  children,
  isFormOpen,
  setIsFormOpenAction: setIsFormOpen,
}: PetDialogProps) {
  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
