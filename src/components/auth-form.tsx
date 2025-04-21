"use client";

import { logIn, signUp } from "@/actions/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import AuthFormBtn from "./auth-form-btn";
import { useActionState } from "react";

// Decided not to use react-hook-form here for simplicity
export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const [logInError, dispatchLogIn] = useActionState(logIn, undefined);
  const [signUpError, dispatchSignUp] = useActionState(signUp, undefined);

  return (
    <div>
      <form
        action={type === "login" ? dispatchLogIn : dispatchSignUp}
        className="space-y-4"
      >
        <div className="space-y-1">
          <Label htmlFor="email" className="space-y-1">
            Email
          </Label>
          <Input id="email" type="email" name="email" required />
        </div>
        <div className="mb-4 space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" required />
        </div>
      </form>
      <AuthFormBtn type={type} />

      {logInError && (
        <p className="text-red-500 text-sm mt-2">logInError.message</p>
      )}
      {signUpError && (
        <p className="text-red-500 text-sm mt-2">signUpError.message</p>
      )}
    </div>
  );
}
