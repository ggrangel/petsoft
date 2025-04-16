"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { addPet, editPet } from "@/actions/actions";
import PetFormButton from "@/components/pet-form-btn";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { petFormSchema } from "@/lib/validations";

type PetFormProps = {
  actionType: "add" | "edit";
  onSubmitAction: () => void;
};

type TPetForm = z.infer<typeof petFormSchema>;

export default function PetForm({ actionType, onSubmitAction }: PetFormProps) {
  const { selectedPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPetForm>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: selectedPet?.name || "",
      ownerName: selectedPet?.ownerName || "",
      imageUrl: selectedPet?.imageUrl || "",
      age: selectedPet?.age || 0,
      notes: selectedPet?.notes || "",
    },
  });

  return (
    <form
      action={async () => {
        const result = await trigger();
        if (!result) {
          return;
        }

        const pet = getValues();

        let err;
        if (actionType === "edit") {
          const petId = selectedPet!.id;
          err = await editPet(petId, pet);
        } else {
          err = await addPet(pet);
        }
        if (err) {
          toast.warning(err.message);
          return;
        }
        onSubmitAction();
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} name="name" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register("ownerName")} name="ownerName" />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" {...register("imageUrl")} name="imageUrl" />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register("age")} name="age" />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} {...register("notes")} name="notes" />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormButton actionType={actionType} />
    </form>
  );
}
