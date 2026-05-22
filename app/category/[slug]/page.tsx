import { notFound } from "next/navigation";
import categoriesData from "@/data/categories.json";
import storesData from "@/data/stores.json";
import { Store, Category } from "@/lib/utils";
import CategoryClient from "./CategoryClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return (categoriesData as Category[]).map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = (categoriesData as Category[]).find((c) => c.slug === slug);
  if (!category) notFound();

  const stores = (storesData as Store[]).filter((s) => s.category === slug);

  return <CategoryClient category={category} stores={stores} />;
}
