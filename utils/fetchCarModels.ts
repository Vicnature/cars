import { sanityClient } from "@/lib/sanity.client";


export async function fetchCarModels() {
  const query = `*[_type == "carModel"]{ _id, name }`;
  return await sanityClient.fetch(query);
}