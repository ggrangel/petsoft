import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";

const config = {
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // Using JWT strategy for better performance (no database lookup required per request).
    // Database sessions offer easier revocation (enhanced security for invalidating sessions).
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login attempt

        const validatedData = authSchema.safeParse(credentials);
        if (!validatedData.success) {
          return null;
        }

        const { email, password } = validatedData.data;

        const user = await getUserByEmail(email);
        if (!user) {
          throw new Error("No user found");
        }

        const passwordMatchs = bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatchs) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on requests with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isAccessingApp = request.nextUrl.pathname.startsWith("/app");
      // if (isLoggedIn && !isAccessingApp) {
      //   return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      // }

      if (!isLoggedIn && isAccessingApp) {
        return false;
      }

      if (isLoggedIn && isAccessingApp) {
        return true;
      }

      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        // on sign in
        token.userId = user.id as string;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
