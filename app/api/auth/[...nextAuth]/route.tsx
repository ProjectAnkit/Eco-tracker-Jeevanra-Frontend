import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { toastError } from "@/lib/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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
          toastError("Email and password are required");
          throw new Error("Email and password are required");
        }

        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const errorMessage = errorData.error || "Login failed";
            toastError("Invalid email or password");
            throw new Error(errorMessage);
          }

          const data = await res.json();
        
          
          if (!data.token) {
         
            toastError("Authentication failed. Please try again.");
            throw new Error("Authentication failed: No token received");
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const user: any = jwtDecode(data.token);
          
          return { 
            id: user.sub || user.id,
            email: user.email || credentials.email,
            name: user.name || user.email,
            accessToken: data.token 
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        let tokenPayload = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((user as any).accessToken) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const base64Url = (user as any).accessToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            tokenPayload = JSON.parse(jsonPayload);
          } catch (error) {
            console.error("Error decoding token:", error);
            toastError("Error decoding token");
          }
        }
        
        return {
          ...token,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        const userId = token.sub || token.id;
        
        return {
          ...session,
          user: {
            ...session.user,
            id: userId as string,
            email: (token.email || token.sub) as string,
            name: token.name as string,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          accessToken: token.accessToken as any,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  debug: process.env.NODE_ENV === 'development',
});

export const { GET, POST } = handlers;

export { signIn, signOut, auth };