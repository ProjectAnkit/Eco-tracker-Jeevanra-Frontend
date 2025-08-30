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
        // Decode the JWT to extract the user ID (browser-compatible)
        let tokenPayload = null;
        if ((user as any).accessToken) {
          try {
            const base64Url = (user as any).accessToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            tokenPayload = JSON.parse(jsonPayload);
          } catch (e) {
            console.error('Error decoding token:', e);
          }
        }
        
        return {
          ...token,
          accessToken: (user as any).accessToken,
          id: tokenPayload?.sub || tokenPayload?.userId || user.id,
          email: tokenPayload?.email || user.email,
          name: tokenPayload?.name || user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Ensure we're using the correct user ID from the token
        const userId = token.sub || token.id;
        
        return {
          ...session,
          user: {
            ...session.user,
            id: userId as string,
            email: (token.email || token.sub) as string, // Use sub as email if email is not present
            name: token.name as string,
          },
          accessToken: token.accessToken as string,
        };
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