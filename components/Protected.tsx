"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function Protected({ children, requiredRole }: ProtectedProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      // Store the current URL for redirecting back after login
      const callbackUrl = window.location.pathname;
      router.push(`/?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (status === "authenticated") {
      // Check if user has required role if specified
      if (requiredRole) {
        // Add your role checking logic here if needed
        // For now, just set as authorized if authenticated
        setIsAuthorized(true);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [status, requiredRole, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
        <h1 className="text-2xl font-semibold text-foreground">Loading</h1>
        <div className="w-32 h-5 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
