"use client";
import { EmailIcon } from "@/assets/icons";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { registerUser } from "@/actions/auth";
import Turnstile from "react-turnstile";
import { toast } from "react-hot-toast";

export default function SignupWithPassword() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [turnstileToken, setTurnstileToken] = useState("");
    const turnstileRef = useRef<any>(null);

    const turnstileEnabled = process.env.NEXT_PUBLIC_TURNSTILE === "true";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (turnstileEnabled && !turnstileToken) {
            setError("Silakan selesaikan verifikasi keamanan.");
            return;
        }

        setLoading(true);
        setError("");

        if (data.password !== data.confirmPassword) {
            setError("Kata sandi tidak cocok");
            setLoading(false);
            if (turnstileEnabled && turnstileRef.current) {
                turnstileRef.current.reset();
            }
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("password", data.password);

            const result = await registerUser(formData, turnstileToken);

            if (result?.error) {
                setError(result.error);
                toast.error(result.error);
                setLoading(false);
                setData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
                if (turnstileEnabled && turnstileRef.current) {
                    turnstileRef.current.reset();
                }
            } else {
                toast.success("Registrasi berhasil! Silakan login.");
            }
        } catch (err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
            setLoading(false);
            if (turnstileEnabled && turnstileRef.current) {
                turnstileRef.current.reset();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-800 dark:bg-red-900/50 dark:text-red-200">
                    {error}
                </div>
            )}

            <InputGroup
                type="text"
                label="Nama Lengkap"
                className="mb-4 [&_input]:py-[15px]"
                placeholder="Masukkan nama lengkap"
                name="name"
                handleChange={handleChange}
                value={data.name}
                icon={
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                }
                required
            />

            <InputGroup
                type="email"
                label="Email"
                className="mb-4 [&_input]:py-[15px]"
                placeholder="Masukkan email anda"
                name="email"
                handleChange={handleChange}
                value={data.email}
                icon={<EmailIcon />}
                required
            />

            <div className="mb-4">
                <InputGroup
                    type={showPassword ? "text" : "password"}
                    label="Kata Sandi"
                    className="[&_input]:py-[15px]"
                    placeholder="Masukkan kata sandi"
                    name="password"
                    handleChange={handleChange}
                    value={data.password}
                    icon={<></>}
                    required
                    append={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4.5 top-1/2 -translate-y-1/2 text-dark opacity-50 hover:opacity-100 dark:text-white"
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    }
                />
            </div>

            <InputGroup
                type={showConfirmPassword ? "text" : "password"}
                label="Konfirmasi Kata Sandi"
                className="mb-5 [&_input]:py-[15px]"
                placeholder="Konfirmasi kata sandi"
                name="confirmPassword"
                handleChange={handleChange}
                value={data.confirmPassword}
                icon={<></>}
                required
                append={
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4.5 top-1/2 -translate-y-1/2 text-dark opacity-50 hover:opacity-100 dark:text-white"
                    >
                        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                }
            />

            {!turnstileEnabled ? null : (
                <div className="mb-5 flex justify-center">
                    <Turnstile
                        // @ts-expect-error - library types are missing ref definition
                        ref={turnstileRef}
                        sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                        onVerify={(token) => setTurnstileToken(token)}
                        theme="auto"
                    />
                </div>
            )}

            <div className="mb-4.5">
                <button
                    type="submit"
                    disabled={loading || (turnstileEnabled && !turnstileToken)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                    ) : (
                        "Daftar"
                    )}
                </button>
            </div>

            <div className="mt-6 text-center">
                <p>
                    Sudah punya akun?{" "}
                    <Link href="/auth" className="text-primary">
                        Masuk
                    </Link>
                </p>
            </div>
        </form>
    );
}
