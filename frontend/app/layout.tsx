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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
              <div style={{ display: "none" }} id="sidebar-mobile" />
              {/* Desktop Sidebar */}
              <div className="desktop-sidebar">
                <Sidebar />
              </div>
              <main style={{ flex: 1, overflow: "hidden" }}>
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>

        <style>{`
          @media (min-width: 768px) {
            .desktop-sidebar { display: block; }
          }
          @media (max-width: 767px) {
            .desktop-sidebar { display: none; }
          }
        `}</style>
      </body>
    </html>
  );
}
