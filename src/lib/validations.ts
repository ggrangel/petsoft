import { z } from "zod";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";

export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(100),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: "Owner name is required" })
      .max(100),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url({ message: "Image URL must be a valid URL" }),
    ]),
    age: z.coerce.number().int().positive().max(999),
    notes: z.union([z.literal(""), z.string().trim().max(1000)]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
  }));

export const petIdSchema = z.string().cuid();

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
