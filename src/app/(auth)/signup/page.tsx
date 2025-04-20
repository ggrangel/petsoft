import AuthForm from "@/components/auth-form";
import Link from "next/link";
import H1 from "@/components/h1";

export default function Page() {
  return (
    <main>
      <H1 className="text-center mb-5">Sign Up</H1>
      <AuthForm type="signup" />

      <p className="mt-6 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold">
          Log in
        </Link>
      </p>
    </main>
  );
}
