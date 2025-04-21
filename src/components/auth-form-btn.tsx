"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function AuthFormBtn({ type }: { type: "login" | "signup" }) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>
      {type === "login" ? "Sign In" : "Sign Up"}
    </Button>
  );
}
