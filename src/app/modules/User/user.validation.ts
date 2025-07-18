import { Role } from "@prisma/client";
import z from "zod";

const CreateTrainerZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(Role).optional(),
  }),
});

const UpdateProfileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
  }),
});

export const UserValidation = {
  CreateTrainerZodSchema,
  UpdateProfileZodSchema,
};
