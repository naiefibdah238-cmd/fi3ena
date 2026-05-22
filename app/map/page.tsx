import MapClient from "./MapClient";
import storesData from "@/data/stores.json";
import categoriesData from "@/data/categories.json";
import { Store, Category } from "@/lib/utils";

export default function MapPage() {
  return (
    <MapClient
      stores={storesData as Store[]}
      categories={categoriesData as Category[]}
    />
  );
}
