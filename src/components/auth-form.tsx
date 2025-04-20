import { logIn, signUp } from "@/actions/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function AuthForm({ type }: { type: "signin" | "signup" }) {
  return (
    <div>
      <form action={type === "signin" ? logIn : signUp} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email" className="space-y-1">
            Email
          </Label>
          <Input id="email" type="email" name="email" />
        </div>
        <div className="mb-4 space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" />
        </div>
        <Button>{type === "signin" ? "Sign In" : "Sign Up"}</Button>
      </form>
    </div>
  );
}
