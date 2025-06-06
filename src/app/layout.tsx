import type { Metadata } from "next";
import "./globals.css"; // Importa os estilos globais, incluindo o Tailwind CSS

export const metadata: Metadata = {
  title: "Gerador de Questionário Interativo",
  description: "Gere questionários personalizados com a ajuda da IA do Gemini.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}