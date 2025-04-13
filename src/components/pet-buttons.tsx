"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import PetForm from "./pet-form";
import PetDialog from "./pet-dialog";

export function AddPetButton() {
  return (
    <PetButtonDialog
      trigger={
        <Button size="icon" className="">
          <PlusIcon className="h-6 w-6" />
        </Button>
      }
      actionType="add"
    />
  );
}

export function EditPetButton() {
  return (
    <PetButtonDialog
      trigger={
        <Button variant="secondary" className="bg-zinc-200 hover:bg-zinc-300">
          Edit
        </Button>
      }
      actionType="edit"
    />
  );
}

type PetButtonDialogProps = {
  trigger: React.ReactNode;
  actionType: "add" | "edit";
};

function PetButtonDialog({ trigger, actionType }: PetButtonDialogProps) {
  const [isFormOpen, setIsFormOpenAction] = useState(false);

  return (
    <PetDialog
      trigger={trigger}
      title={actionType === "add" ? "Add Pet" : "Edit Pet"}
      isFormOpen={isFormOpen}
      setIsFormOpenAction={setIsFormOpenAction}
    >
      <PetForm
        actionType={actionType}
        onSubmitAction={() => setIsFormOpenAction(false)}
      />
    </PetDialog>
  );
}

type CheckoutPetButtonProps = {
  onClickAction: () => void;
};

export function CheckoutPetButton({
  onClickAction: onClick,
}: CheckoutPetButtonProps) {
  return (
    <Button
      variant="secondary"
      className="bg-zinc-200 hover:bg-zinc-300"
      onClick={() => onClick()}
    >
      Checkout
    </Button>
  );
}
