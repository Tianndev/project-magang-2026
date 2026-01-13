"use client";
import { EmailIcon } from "@/assets/icons";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { loginUser } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Turnstile from "react-turnstile";
import { toast } from "react-hot-toast";

export default function SigninWithPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<any>(null);

  const turnstileEnabled = process.env.NEXT_PUBLIC_TURNSTILE === "true";

  React.useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Registrasi berhasil! Silakan login.");
    }
  }, [searchParams]);

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

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("remember", String(data.remember));

      const result = await loginUser(formData, turnstileToken);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        setLoading(false);
        setData((prev) => ({ ...prev, password: "" }));
        if (turnstileEnabled && turnstileRef.current) {
          turnstileRef.current.reset();
        }
      } else {
        toast.success("Login berhasil!");
        router.push("/");
        router.refresh();
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
      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 size={16} className="shrink-0" />
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

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

      <InputGroup
        type={showPassword ? "text" : "password"}
        label="Kata Sandi"
        className="mb-5 [&_input]:py-[15px]"
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

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Ingat saya"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Lupa Kata Sandi?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading || (turnstileEnabled && !turnstileToken)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
          ) : (
            "Masuk"
          )}
        </button>
      </div>
    </form>
  );
}
