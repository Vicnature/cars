import { sanityClient } from "@/lib/sanity.client";

export async function fetchBrands() {
  const query = `*[_type == "brand"]{ _id, name }`;
  return await sanityClient.fetch(query);
}