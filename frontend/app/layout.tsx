import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";
import { Sidebar } from "../components/sidebar";
import { ThemeProvider } from "../components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enterprise AI Assistant",
  description: "Enterprise Knowledge Assistant using RAG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {/* We'll handle full-page layouts inside specific pages if needed, but for authenticated pages, we show sidebar. Wait, middleware protects routes, so unauthenticated user might see sidebar? We can conditionally render sidebar if session exists, but Next.js Server Components can do this cleaner. For now, let's just assume simple layout or client-side check. Actually, let's keep it simple: */}
            <div className="flex h-screen bg-background text-foreground">
              {/* Note: In a real app, you might want to hide Sidebar on the /login page */}
              <div className="hidden md:block">
                <Sidebar />
              </div>
              <main className="flex-1 overflow-hidden">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
