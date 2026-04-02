import type { Metadata } from "next";
import { DM_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ClerkProvider } from "@clerk/nextjs";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans" });

export const metadata: Metadata = {
  title: "Controle de Finanças - Vault",
  description: "Sistema de controle de finanças pessoais e metas financeiras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </head>
        <body className={`${dmSans.variable} ${sourceSans.variable} bg-[#131313] text-[#e5e2e1] antialiased min-h-screen overflow-x-hidden`}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
