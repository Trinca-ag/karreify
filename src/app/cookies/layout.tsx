import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Como o Karreify utiliza cookies e tecnologias similares, e como você pode gerenciá-los.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
