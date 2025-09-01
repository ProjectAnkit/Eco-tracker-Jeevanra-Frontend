"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, Sun, Moon, LogOut, LogIn, UserPlus } from "lucide-react";
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
      await signOut({ callbackUrl: '/' });
      toastSuccess('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toastError('Failed to sign out. Please try again.');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-2 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-3xl text-emerald-700 dark:text-white font-['Playfair_Display'] font-medium italic">
            Jeevanra
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-2 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard" className="text-3xl text-emerald-700 dark:text-white font-['Playfair_Display'] font-medium italic">
          Jeevanra
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3">
          {!session ? (
            <>
              <AuthForm>
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              </AuthForm>
              <AuthForm defaultTab="signup">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </AuthForm>
            </>
          ) : session ? (
            <>
              <Link href="/dashboard" className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${pathname === '/dashboard' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                Dashboard
              </Link>
              <Link href="/track" className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${pathname === '/track' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                Track
              </Link>
              <Link href="/challenges" className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 ${pathname?.startsWith('/challenges') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                Challenges
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{session.user?.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full text-slate-700 dark:text-slate-200 hover:text-emerald-600">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/30"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Link href="/">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700">
              <SheetHeader>
                <SheetTitle className="text-left text-lg font-semibold text-slate-900 dark:text-white">
                  {session ? 'Menu' : 'Welcome'}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-1">
                {!session && (
                  <>
                    <AuthForm>
                      <Button variant="ghost" className="w-full justify-start text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </AuthForm>
                    <AuthForm defaultTab="signup">
                      <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </Button>
                    </AuthForm>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-3"></div>
                  </>
                )}
                {session ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg mb-4">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {session.user?.email?.split("@")[0]}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Eco Warrior</div>
                      </div>
                    </div>
                    
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        📊
                      </div>
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    
                    <Link href="/track" className="flex items-center gap-3 p-3 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        🌱
                      </div>
                      <span className="font-medium">Track Activity</span>
                    </Link>
                    
                    <Link href="/challenges" className="flex items-center gap-3 p-3 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        🏆
                      </div>
                      <span className="font-medium">Challenges</span>
                    </Link>
                    
                    <Link href="/profile" className="flex items-center gap-3 p-3 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        👤
                      </div>
                      <span className="font-medium">Profile</span>
                    </Link>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full justify-start gap-3 p-3 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </div>
                        <span className="font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full justify-start gap-3 p-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
                      >
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                          🚪
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="w-full justify-start gap-3 p-3 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      </div>
                      <span className="font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                    </Button>
                    
                    <Link href="/" className="flex items-center gap-3 p-3 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        🔑
                      </div>
                      <span className="font-medium">Sign In</span>
                    </Link>
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