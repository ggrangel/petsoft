"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type PetContextType = {
  pets: Pet[];
  selectedPet: Pet | undefined;
  handleAddPet: (pet: Omit<Pet, "id">) => void;
  handleEditPet: (id: string, pet: Omit<Pet, "id">) => void;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
};
export const PetContext = createContext<PetContextType | null>(null);

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  // event handlers / action
  const handleAddPet = (newPet: Omit<Pet, "id">) => {
    setPets((prev) => [
      ...prev,
      {
        ...newPet,
        id: Date.now().toString(),
      },
    ]);
  };

  const handleEditPet = (id: string, newPetData: Omit<Pet, "id">) => {
    setPets((prev) =>
      prev.map((pet) => (pet.id === id ? { ...pet, ...newPetData } : pet)),
    );
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPet,
        handleAddPet,
        handleEditPet,
        handleChangeSelectedPetId,
        handleCheckoutPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
