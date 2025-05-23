"use client";

import { usePetContext } from "@/lib/hooks";
import { Pet } from "@prisma/client";
import Image from "next/image";
import { CheckoutPetButton, EditPetButton } from "./pet-buttons";
import { deletePet } from "@/actions/actions";
import { toast } from "sonner";

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  return (
    <section className="flex flex-col h-full w-full">
      {!selectedPet ? (
        <div className="h-full w-full flex justify-center items-center">
          <EmptyView />
        </div>
      ) : (
        <>
          <TopBar pet={selectedPet!} />
          <OtherInfo pet={selectedPet!} />
          <Notes pet={selectedPet!} />
        </>
      )}
    </section>
  );
}

function EmptyView() {
  return <p className="text-2xl font-medium">No pet selected </p>;
}

type Props = {
  pet: Pet;
};

function TopBar({ pet }: Props) {
  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-black/[0.08]">
      <Image
        src={pet.imageUrl}
        alt="Selected pet image"
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />
      <h2 className="text-3xl font-semibold leading-7 ml-5">{pet.name}</h2>
      <div className="ml-auto space-x-2">
        <EditPetButton />
        <CheckoutPetButton
          onClickAction={async () => {
            const err = await deletePet(pet.id);
            if (err) {
              toast.warning(err.message);
            }
          }}
        />
      </div>
    </div>
  );
}

function OtherInfo({ pet }: Props) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{pet.ownerName}</p>
      </div>
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{pet.age}</p>
      </div>
    </div>
  );
}

function Notes({ pet }: Props) {
  return (
    <section className="bg-white px-7 py-5 rounded-md mb-9 mx-8 flex-1 border-b border-black/[0.08]">
      {pet.notes}
    </section>
  );
}
