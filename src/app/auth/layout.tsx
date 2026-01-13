import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import { Providers } from "../providers";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-2 p-4 dark:bg-[#020d1a]">
                <div className="w-full max-w-[1000px]">
                    {children}
                </div>
            </div>
        </Providers>
    );
}