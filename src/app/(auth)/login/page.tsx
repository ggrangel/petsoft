import AuthForm from "@/components/auth-form";
import Link from "next/link";
import H1 from "@/components/h1";

export default function Page() {
  return (
    <main>
      <H1 className="text-center mb-5">Log In</H1>
      <AuthForm />

      <p className="mt-6 text-sm text-zinc-500">
        No account yet?{" "}
        <Link href="/signup" className="font-bold">
          Sign up
        </Link>
      </p>
    </main>
  );
}
