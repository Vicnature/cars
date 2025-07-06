// utils/fetchSpareParts.ts
import { sanityClient } from "@/lib/sanity.client";
import { sparePartsQuery } from "@/lib/queries";

export async function fetchSpareParts() {
  try {
    const result = await sanityClient.fetch(sparePartsQuery);
    return result;
  } catch (error) {
    console.error("Failed to fetch spare parts:", error);
    return [];
  }
}
