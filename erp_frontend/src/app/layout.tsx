import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; 
import { AuthGuard } from "@/components/auth/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BGM ERP",
  description: "Sistema de Vendas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <AuthProvider>
          <AuthGuard>
            <main className="flex flex-col w-full min-h-screen">
              {children}
            </main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}