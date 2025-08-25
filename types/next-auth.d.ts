// next-auth.d.ts
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // Add accessToken to the Session type
  }
}