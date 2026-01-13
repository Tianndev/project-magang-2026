import { z } from "zod";

export const emailSchema = z.email({ message: "Alamat email tidak valid" });

export const passwordSchema = z
    .string()
    .min(8, "Kata sandi minimal 8 karakter");

export const nameSchema = z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama terlalu panjang");

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Kata sandi wajib diisi"),
});

export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
});