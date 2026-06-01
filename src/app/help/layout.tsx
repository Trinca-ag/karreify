import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Central de Ajuda",
  description:
    "Tire suas dúvidas sobre o Karreify: como criar currículo com IA, análise de currículo, vagas, moedas e mais.",
  alternates: { canonical: "/help" },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
