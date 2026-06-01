import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProfession,
  professionMetadata,
  allProfessionSlugs,
} from "@/content/professions";
import { ProfessionResume } from "@/components/content/ProfessionResume";

export const dynamicParams = false;

export function generateStaticParams() {
  return allProfessionSlugs().map((profissao) => ({ profissao }));
}

export function generateMetadata({
  params,
}: {
  params: { profissao: string };
}): Metadata {
  return professionMetadata(params.profissao);
}

export default function Page({ params }: { params: { profissao: string } }) {
  const profession = getProfession(params.profissao);
  if (!profession) notFound();
  return <ProfessionResume profession={profession} />;
}
