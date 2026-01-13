import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "USER" | "ADMIN" | "MANAGER";
            image?: string | null;
            createdAt: Date | string;
        } & DefaultSession["user"];
    }

    interface User {
        role: "USER" | "ADMIN" | "MANAGER";
        remember?: boolean;
        createdAt: Date | string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: "USER" | "ADMIN" | "MANAGER";
        id: string;
        image?: string | null;
        createdAt: Date | string;
    }
}