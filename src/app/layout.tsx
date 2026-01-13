import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || "NextAdmin"}`,
    default: process.env.NEXT_PUBLIC_APP_NAME || "NextAdmin",
  }
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="bg-gray-2 text-dark-5 antialiased dark:bg-[#020D1A] dark:text-dark-6">
        <Providers>
          <NextTopLoader color="#197AB0" showSpinner={false} />
          {children}
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}