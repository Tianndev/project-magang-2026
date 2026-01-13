"use server";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { registerSchema } from "@/lib/validations/auth";
import { AUTH_CONSTANTS, AUTH_ERRORS, AUTH_ROUTES } from "@/lib/constants/auth";
import { sanitizeEmail, sanitizeString } from "@/lib/utils/sanitize";
import { checkRateLimit, clearRateLimit } from "@/lib/utils/rate-limit";
import { z } from "zod";
import { headers } from "next/headers";

async function validateTurnstile(token?: string) {
    if (process.env.NEXT_PUBLIC_TURNSTILE !== "true") return { success: true };

    if (!token) {
        return { success: false, error: "Silakan selesaikan verifikasi keamanan (captcha)." };
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) throw new Error("Turnstile secret key is not configured");

    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, {
        body: formData,
        method: "POST",
    });

    const outcome = await result.json();
    if (!outcome.success) {
        return { success: false, error: "Verifikasi keamanan gagal. Silakan coba lagi." };
    }

    return { success: true };
}

async function getClientIP(): Promise<string> {
    const headersList = await headers();
    return (
        headersList.get("x-forwarded-for")?.split(",")[0] ||
        headersList.get("x-real-ip") ||
        "unknown"
    );
}

export async function registerUser(formData: FormData, token?: string) {
    const ip = await getClientIP();
    const rateLimit = await checkRateLimit(ip, "REGISTER");

    if (!rateLimit.success) {
        return {
            error: "Terlalu banyak percobaan registrasi. Silakan coba lagi nanti.",
        };
    }

    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const turnstile = await validateTurnstile(token);
        if (!turnstile.success) {
            return { error: turnstile.error };
        }

        if (!name || !email || !password) {
            return { error: "Semua kolom wajib diisi" };
        }

        const rawData = {
            name: sanitizeString(name),
            email: sanitizeEmail(email),
            password: password,
        };

        const validatedData = registerSchema.parse(rawData);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
            select: { id: true },
        });

        if (existingUser) {
            return { error: AUTH_ERRORS.USER_EXISTS };
        }

        const hashedPassword = await bcrypt.hash(
            validatedData.password,
            AUTH_CONSTANTS.SALT_ROUNDS
        );

        await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                role: "USER",
            },
            select: { id: true },
        });

        clearRateLimit(ip, "REGISTER");
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message };
        }
        return { error: AUTH_ERRORS.REGISTRATION_FAILED };
    }

    redirect(`${AUTH_ROUTES.SIGN_IN}?registered=true`);
}

export async function loginUser(formData: FormData, token?: string) {
    const ip = await getClientIP();
    const email = sanitizeEmail(formData.get("email") as string);

    const rateLimit = await checkRateLimit(`${ip}:${email}`, "LOGIN");

    if (!rateLimit.success) {
        return {
            error: "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
        };
    }

    const password = formData.get("password") as string;
    const remember = formData.get("remember") === "true";

    const turnstile = await validateTurnstile(token);
    if (!turnstile.success) {
        return { error: turnstile.error };
    }

    if (!email || !password) {
        return { error: "Email dan kata sandi wajib diisi" };
    }

    try {
        const result = await signIn("credentials", {
            email,
            password,
            remember,
            redirect: false,
        });

        if (result?.error) {
            return { error: AUTH_ERRORS.INVALID_CREDENTIALS };
        }

        clearRateLimit(`${ip}:${email}`, "LOGIN");
        return { success: true };
    } catch (error) {
        console.error("Login error:", error);
        return { error: AUTH_ERRORS.INVALID_CREDENTIALS };
    }
}

export async function logoutUser() {
    await signOut({ redirectTo: AUTH_ROUTES.SIGN_IN });
}