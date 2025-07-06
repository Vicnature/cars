// utils/fetchSpareParts.ts
import { sanityClient } from "@/lib/sanity.client";

export const fetchSpareParts = async ({ search = "" } = {}) => {
  const sanitizedSearch = search.trim().toLowerCase();
  const query = `
    *[_type == "sparePart" && (
      title match "${sanitizedSearch}*" ||
      brand->name match "${sanitizedSearch}*" ||
      model->name match "${sanitizedSearch}*"
    )]{
      _id,
      title,
      description,
      price,
      inStock,
      "brand": brand->name,
      "model": model->name,
      "category": category->name,
      "images": images[].asset->url
    } | order(_createdAt desc)
  `;
  return await sanityClient.fetch(query);
};
