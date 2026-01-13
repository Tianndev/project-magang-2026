import type { NextAuthConfig } from "next-auth";
import { AUTH_ROUTES } from "@/lib/constants/auth";

export const authConfig = {
    pages: {
        signIn: AUTH_ROUTES.SIGN_IN,
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthPage = nextUrl.pathname.startsWith("/auth");

            if (isAuthPage) {
                if (isLoggedIn) {
                    return Response.redirect(new URL(AUTH_ROUTES.HOME, nextUrl));
                }
                return true;
            }

            return isLoggedIn;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
