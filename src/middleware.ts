import { auth } from "@/lib/auth";

export default auth;

export const config = {
  // Run middleware on all paths except for the ones specified
  // That is, the ones that are not API routes (static files)
  mathcer: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
