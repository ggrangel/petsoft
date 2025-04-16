"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { petFormSchema, petIdSchema } from "@/lib/validations";

// This is a server function. Hence, pet data may be anything.
// This forces us to validate the pet data before using it.
export async function addPet(pet: unknown) {
  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({ data: validatedPet.data });
  } catch (error) {
    console.log("Error adding pet: ", error);
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, pet: unknown) {
  const validatedId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(pet);

  if (!validatedPet.success || !validatedId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: validatedId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    console.log("Error editing pet: ", error);
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  const validatedId = petIdSchema.safeParse(petId);
  if (!validatedId.success) {
    return {
      message: "Invalid pet ID.",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedId.data,
      },
    });
  } catch (error) {
    console.log("Error deleting pet: ", error);
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
}
