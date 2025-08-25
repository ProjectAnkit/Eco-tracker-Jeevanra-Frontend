import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import { toastError } from "@/lib/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          toastError("Email and password are required");
          throw new Error("Email and password are required");
        }

        try {
          console.log("Attempting login with:", credentials.email);
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log("Login response status:", res.status);
          
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const errorMessage = errorData.error || "Login failed";
            console.log("Login failed:", errorMessage);
            toastError("Invalid email or password");
            throw new Error(errorMessage);
          }

          const data = await res.json();
          console.log("Login successful, received data:", data);
          
          if (!data.token) {
            console.log("No token received from backend");
            toastError("Authentication failed. Please try again.");
            throw new Error("Authentication failed: No token received");
          }

          const user: any = jwtDecode(data.token);
          console.log("Decoded user:", user);
          
          return { 
            id: user.sub || user.id,
            email: user.email || credentials.email,
            name: user.name || user.email,
            accessToken: data.token 
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error; // Re-throw to show error in the UI
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: (user as any).accessToken,
          id: user.id,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',  // Redirect to home page for sign in
    error: '/',   // Redirect to home page for auth errors
  },
  // Error handling is done through the pages.error route and the authorize callback
  // You can customize the error page in pages/error.tsx
  debug: process.env.NODE_ENV === 'development',
});

// Export the HTTP handlers for Next.js App Router
export const { GET, POST } = handlers;

// Export auth utilities for use in other parts of the app
export { signIn, signOut, auth };