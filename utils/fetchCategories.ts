import { sanityClient } from "@/lib/sanity.client";


export async function fetchCategories() {
  const query = `*[_type == "category"]{ _id, name }`;
  return await sanityClient.fetch(query);
}