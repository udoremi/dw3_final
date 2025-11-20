import { Inter } from "next/font/google";
import "./globals.css";

// Configuração da fonte
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} font-sans
                   min-h-screen bg-background text-foreground antialiased`}
      >
        <main className="flex flex-col w-full">
          {children}
        </main>
      </body>
    </html>
  );
}