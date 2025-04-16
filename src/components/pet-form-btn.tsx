import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function PetFormButton({
  actionType,
}: {
  actionType: "add" | "edit";
}) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" className="mt-5 self-end">
      {actionType === "add" ? "Add Pet" : "Edit Pet"}
    </Button>
  );
}
