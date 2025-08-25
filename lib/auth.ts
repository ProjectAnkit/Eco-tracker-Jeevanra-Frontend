import { auth } from "@/app/api/auth/[...nextAuth]/route";

export async function getSession() {
  return await auth();
}