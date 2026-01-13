import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { loginSchema } from "@/lib/validations/auth";
import { AUTH_CONSTANTS, AUTH_ROUTES } from "@/lib/constants/auth";
import { sanitizeEmail } from "@/lib/utils/sanitize";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
        maxAge: AUTH_CONSTANTS.SESSION_MAX_AGE,
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember Me", type: "text" },
            },
            async authorize(credentials) {
                try {
                    const sanitizedEmail = sanitizeEmail(credentials?.email as string);
                    const validatedCreds = loginSchema.parse({
                        email: sanitizedEmail,
                        password: credentials?.password as string,
                    });

                    const user = await prisma.user.findUnique({
                        where: { email: validatedCreds.email },
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            password: true,
                            role: true,
                            image: true,
                            createdAt: true,
                        },
                    });

                    if (!user?.password) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        validatedCreds.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        image: user.image || "/images/user/default.webp",
                        createdAt: user.createdAt,
                        remember: credentials?.remember === "true" || credentials?.remember === true,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.image = user.image;
                token.createdAt = user.createdAt;

                const isRemembered = user.remember;
                const currentTime = Math.floor(Date.now() / 1000);
                const expiry = isRemembered
                    ? currentTime + AUTH_CONSTANTS.SESSION_MAX_AGE
                    : currentTime + AUTH_CONSTANTS.SESSION_DEFAULT_AGE;

                token.exp = expiry;
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as "USER" | "ADMIN" | "MANAGER";
                session.user.id = token.id as string;
                session.user.image = token.image as string | null;
                session.user.createdAt = token.createdAt as Date | string;
            }
            return session;
        },
    },
    pages: {
        signIn: AUTH_ROUTES.SIGN_IN,
    },
});
