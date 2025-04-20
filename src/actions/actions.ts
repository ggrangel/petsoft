"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function logIn(formData: FormData) {
  await signIn("credentials", formData);

  redirect("/app/dashboard");
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10,
  );

  try {
    await prisma.user.create({
      data: {
        email: formData.get("email") as string,
        hashedPassword,
      },
    });
  } catch (error) {
    console.log("Error signing up: ", error);
    return {
      message: "Could not create user.",
    };
  }

  await signIn("credentials", formData);
  redirect("/app/dashboard");
}

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
