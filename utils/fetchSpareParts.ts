import { sanityClient } from "@/lib/sanity.client";
import { sparePartsQuery } from "@/lib/queries";

export async function fetchSpareParts(filters = {}) {
  const query = sparePartsQuery(filters);
  return await sanityClient.fetch(query);
}
