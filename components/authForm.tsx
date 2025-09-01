"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { Transition } from "framer-motion";
import { toastSuccess, toastError } from "@/lib/toast";
import { Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

interface AuthFormProps {
  children?: React.ReactNode;
  defaultTab?: "login" | "signup";
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      when: "beforeChildren",
    } as Transition,
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 20 } as Transition,
  },
};

export default function AuthForm({ children, defaultTab = "login" }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(defaultTab === "signup");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: name || undefined }),
        });

        if (res.ok) {
          toastSuccess("Registration successful! Please login.");
          setIsRegister(false);
          setEmail(email);
          setPassword("");
        } else {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Registration failed");
        }
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (result?.error) throw new Error(result.error);

        if (result?.url) {
          toastSuccess("Login successful!");
          window.location.href = result.url;
          return;
        }
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      toastError("Failed to authenticate ! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => setIsRegister(!isRegister);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="group flex items-center gap-1.5 text-xs">
            Get Started
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg w-[90vw] h-[380px] p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg">
        <div className="flex flex-row h-full">
          {/* Left - Image */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-teal-900/20 items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1693414854278-6b3703411629?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Eco-friendly plant"
                fill
                className="object-cover"
                sizes="40vw"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Right - Form */}
          <div className="w-full md:w-1/2 px-5 py-6 pb-8 flex flex-col justify-center items-center">
            <DialogHeader className="pb-3 text-center">
              <DialogTitle className="text-base font-semibold text-slate-900 dark:text-white mb-0.5">
                {isRegister ? "Create your account" : "Welcome back"}
              </DialogTitle>
              <p className="text-slate-500 dark:text-slate-400 text-[10px]">
                {isRegister ? "Join our eco community today" : "Sign in to continue to Jeevanra"}
              </p>
            </DialogHeader>

            <motion.form
              onSubmit={handleAuth}
              className="w-full max-w-[240px] space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isRegister ? "register" : "login"}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {isRegister && (
                    <motion.div className="space-y-1" variants={itemVariants}>
                      <label htmlFor="name" className="text-[8px] font-medium text-slate-700 dark:text-slate-300">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-7 pl-8 pr-2 rounded-sm text-[10px]"
                          required={isRegister}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[8px] font-medium text-slate-700 dark:text-slate-300">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-7 pl-8 pr-2 text-[10px] rounded-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-[8px] font-medium text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      {!isRegister && (
                        <a href="#" className="text-[8px] text-emerald-600 dark:text-emerald-400">
                          Forgot?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isRegister ? "Create a password" : "Enter your password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-7 pl-8 pr-8 rounded-sm text-[10px]"
                        required
                        minLength={isRegister ? 8 : undefined}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                    {isRegister && (
                      <p className="text-[8px] text-slate-500 dark:text-slate-400">
                        Use 8+ characters with letters, numbers & symbols
                      </p>
                    )}
                  </div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      disabled={!email || !password || (isRegister && !name) || loading}
                      className="w-full h-7 text-[10px] font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.01] transition-transform rounded-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          {isRegister ? "Creating..." : "Signing in..."}
                        </>
                      ) : isRegister ? (
                        "Create account"
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <motion.div className="mt-2 text-center text-[10px]" variants={itemVariants}>
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  disabled={loading}
                >
                  {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}