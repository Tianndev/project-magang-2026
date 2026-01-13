import Link from "next/link";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Belum punya akun?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Daftar
          </Link>
        </p>
      </div>
    </>
  );
}