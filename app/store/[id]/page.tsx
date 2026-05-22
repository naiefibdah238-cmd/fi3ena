import { notFound } from "next/navigation";
import storesData from "@/data/stores.json";
import { Store } from "@/lib/utils";
import StoreDetailClient from "./StoreDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return (storesData as Store[]).map((s) => ({ id: s.id }));
}

export default async function StorePage({ params }: Props) {
  const { id } = await params;
  const store = (storesData as Store[]).find((s) => s.id === id);
  if (!store) notFound();
  return <StoreDetailClient store={store} />;
}
