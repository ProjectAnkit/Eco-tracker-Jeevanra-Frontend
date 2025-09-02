import "./globals.css";
import { Inter, Playfair_Display, Sacramento } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/themeProvider";
import Navbar from "@/components/navBar";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { ToastProvider } from "@/components/toastProvider";

const inter = Inter({ subsets: ["latin"] });

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const sacramento = Sacramento({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sacramento',
});

export const metadata: Metadata = {
  title: "EcoTrackr",
  description: "Track and reduce your carbon footprint",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable} ${sacramento.variable} font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <Navbar />
            <main className="relative">
              {children}
            </main>
            <Toaster position="top-right" />
            <ToastProvider />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}