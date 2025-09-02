"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";
import { toastSuccess, toastError } from "@/lib/toast";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import AuthForm from "./authForm";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toastSuccess("Successfully signed out");
    } catch (error) {
      console.error("Error signing out:", error);
      toastError("Failed to sign out. Please try again.");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 shadow-sm transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href="/"
            className={`${theme === "dark" ? "text-white" : "text-slate-800"} text-3xl font-normal hover:opacity-80 transition-opacity font-sacramento`}
          > 
            Jeevanra
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <div className="w-20 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 shadow-sm transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/dashboard"
          className={`${theme === "dark" ? "text-white" : "text-slate-800"} text-3xl font-normal font-sacramento`}
        >
          Jeevanra
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-end flex-1">
          <div className="flex items-center space-x-6">
            {!session ? (
              <>
                <AuthForm>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${theme === 'dark' ? 'text-white' : 'text-black'} ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'} rounded-xl font-medium px-4 py-2 transition-all duration-200`}
                  >
                    Sign In
                  </Button>
                </AuthForm>
                <AuthForm defaultTab="signup">
                  <Button
                    size="sm"
                    className={`${
                      theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                    } hover:bg-${
                      theme === "dark" ? "white/80" : "black/80"
                    } rounded-xl font-medium px-5 py-2 transition-all duration-300 shadow-sm hover:shadow-md`}
                  >
                    Sign Up
                  </Button>
                </AuthForm>
              </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 ${
                  pathname === "/dashboard"
                    ? theme === "dark"
                      ? "bg-white/10 text-white"
                      : "bg-black/10 text-black"
                    : theme === "dark"
                    ? "text-white/80 hover:text-black hover:bg-white/90"
                    : "text-black/80 hover:text-white hover:bg-black/90"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/track"
                className={`text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 ${
                  pathname === "/track"
                    ? theme === "dark"
                      ? "bg-white/10 text-white"
                      : "bg-black/10 text-black"
                    : theme === "dark"
                    ? "text-white/80 hover:text-black hover:bg-white/90"
                    : "text-black/80 hover:text-white hover:bg-black/90"
                }`}
              >
                Track
              </Link>
              <Link
                href="/challenges"
                className={`text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 ${
                  pathname?.startsWith("/challenges")
                    ? theme === "dark"
                      ? "bg-white/10 text-white"
                      : "bg-black/10 text-black"
                    : theme === "dark"
                    ? "text-white/80 hover:text-black hover:bg-white/90"
                    : "text-black/80 hover:text-white hover:bg-black/90"
                }`}
              >
                Challenges
              </Link>
              <ThemeToggle />
              {session && (
                <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    theme === "dark"
                      ? "text-white/80 hover:text-black hover:bg-white/90"
                      : "text-black/80 hover:text-white hover:bg-black/90"
                  } px-4 py-2 rounded-xl transition-all duration-300`}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{session?.user?.email?.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`${
                  theme === "dark" ? "bg-slate border-slate-900" : "bg-white/95 border-black/10"
                } shadow-lg rounded-xl p-2 backdrop-blur-sm`}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className={`w-full ${
                      theme === "dark"
                        ? "text-white/80 hover:text-black hover:bg-white/90"
                        : "text-black/80 hover:text-white hover:bg-black/90"
                    } rounded-lg px-3 py-2`}
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer flex items-center gap-2 text-red-500 hover:bg-red-500/10 rounded-lg px-3 py-2"
                >
                  Sign out
                </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )}
            </>
          )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`${theme === "dark" ? "text-white" : "text-black"}/80 hover:bg-white/5 rounded-xl transition-all duration-200`}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={`w-[320px] p-6 ${
                theme === 'dark' 
                  ? 'bg-slate border-l border-black' 
                  : 'bg-white border-l border-black/10'
              } backdrop-blur-sm`}
            >
              <SheetHeader className="pb-6">
                <SheetTitle
                  className={`text-left text-xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {session ? "Menu" : "Welcome"}
                </SheetTitle>
              </SheetHeader>
              <nav className="space-y-2">
                {session && (
                  <div className="px-4 py-3">
                    <ThemeToggle />
                  </div>
                )}
                {!session && (
                  <>
                    <AuthForm>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start px-4 py-3 ${
                          theme === "dark"
                            ? "text-white/80 hover:text-black hover:bg-white/90"
                            : "text-black/80 hover:text-white hover:bg-black/90"
                        } rounded-xl font-medium transition-all duration-300`}
                      >
                        Sign In
                      </Button>
                    </AuthForm>
                    <AuthForm defaultTab="signup">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start px-4 py-3 ${
                          theme === "dark"
                            ? "text-white/80 hover:text-black hover:bg-white/90"
                            : "text-black/80 hover:text-white hover:bg-black/90"
                        } rounded-xl font-medium transition-all duration-300`}
                      >
                        Create Account
                      </Button>
                    </AuthForm>
                  </>
                )}
                {session && (
                  <>
                    <div
                      className={`flex items-center gap-4 p-4 ${
                        theme === "dark" ? "bg-white/5" : "bg-black/5"
                      } rounded-xl`}
                    >
                      <div
                        className={`w-12 h-12 ${
                          theme === "dark" ? "bg-black/50" : "bg-white/50"
                        } rounded-full flex items-center justify-center shadow-sm`}
                      >
                        <User
                          className={`h-6 w-6 ${theme === "dark" ? "text-white/80" : "text-black/80"}`}
                        />
                      </div>
                      <div>
                        <div
                          className={`text-sm font-semibold ${
                            theme === "dark" ? "text-white" : "text-black"
                          }`}
                        >
                          {session.user?.email?.split("@")[0]}
                        </div>
                        <div
                          className={`text-xs ${theme === "dark" ? "text-white/60" : "text-black/60"}`}
                        >
                          Member
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className={`flex items-center justify-between px-4 py-3 ${
                        theme === "dark"
                          ? "text-white/80 hover:text-black hover:bg-white/90"
                          : "text-black/80 hover:text-white hover:bg-black/90"
                      } rounded-xl font-medium transition-all duration-300`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/track"
                      className={`flex items-center justify-between px-4 py-3 ${
                        theme === "dark"
                          ? "text-white/80 hover:text-black hover:bg-white/90"
                          : "text-black/80 hover:text-white hover:bg-black/90"
                      } rounded-xl font-medium transition-all duration-300`}
                    >
                      Track Activity
                    </Link>
                    <Link
                      href="/challenges"
                      className={`flex items-center justify-between px-4 py-3 ${
                        theme === "dark"
                          ? "text-white/80 hover:text-black hover:bg-white/90"
                          : "text-black/80 hover:text-white hover:bg-black/90"
                      } rounded-xl font-medium transition-all duration-300`}
                    >
                      Challenges
                    </Link>
                    <Link
                      href="/profile"
                      className={`flex items-center justify-between px-4 py-3 ${
                        theme === "dark"
                          ? "text-white/80 hover:text-black hover:bg-white/90"
                          : "text-black/80 hover:text-white hover:bg-black/90"
                      } rounded-xl font-medium transition-all duration-300`}
                    >
                      Profile
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-between px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-all duration-300"
                    >
                      Sign Out
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}