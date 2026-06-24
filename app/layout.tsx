import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/Toast";

const outfit = Outfit({
  variable: "--font-outfit",
  weight: "500",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naomi - Budget Tracker",
  description: "Personal Finance Tracker",
  icons: {
    icon: "/buddy.webp",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-grayBg dark:bg-[#0F172A] font-sans max-w-md mx-auto relative pb-28 text-dark dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AppProvider>{children}</AppProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
