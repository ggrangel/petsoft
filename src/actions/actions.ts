"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export async function logIn(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials.",
          };
        default:
          return {
            message: "Something went wrong.",
          };
      }
    }
    throw error; // nextjs 'redirect' (used in signIn) throw error to work, so we need to rethrow it
  }
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function signUp(prevState: unknown, formData: FormData) {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  const formDataEntries = Object.fromEntries(formData.entries());
  const validatedData = authSchema.safeParse(formDataEntries);
  if (!validatedData.success) {
    return {
      message: "Invalid form data.",
    };
  }
  const { email, password } = validatedData.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }
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
  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
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

  // authentication
  const session = await checkAuth();

  if (!validatedPet.success || !validatedId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // authorization (user owns pet)
  const petData = await getPetById(validatedId.data);
  if (!petData) {
    return {
      message: "Pet not found.",
    };
  }
  if (petData.userId !== session.user.id) {
    return {
      message: "Not authorized.",
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
  // authentication
  const session = await checkAuth();

  // validation
  const validatedId = petIdSchema.safeParse(petId);
  if (!validatedId.success) {
    return {
      message: "Invalid pet ID.",
    };
  }

  // authorization (user owns pet)
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedId.data,
    },
    select: {
      userId: true,
    },
  });

  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
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
