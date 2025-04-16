import { Pet } from "@prisma/client";

export type PetModel = Omit<Pet, "createdAt" | "updatedAt" | "id">;
