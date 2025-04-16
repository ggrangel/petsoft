"use client";

import { Pet } from "@prisma/client";
import { createContext, useState } from "react";

type PetContextType = {
  pets: Pet[];
  selectedPet: Pet | undefined;
  handleChangeSelectedPetId: (id: string) => void;
};
export const PetContext = createContext<PetContextType | null>(null);

type PetContextProviderProps = {
  pets: Pet[];
  children: React.ReactNode;
};

export default function PetContextProvider({
  pets,
  children,
}: PetContextProviderProps) {
  // state
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPet,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
