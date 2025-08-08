import { sanityClient } from "@/lib/sanity.client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { title, brandId, modelId, categoryId, year, price, inStock, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const result = await sanityClient.create({
      _type: "sparePart",
      title,
      slug: { current: slug },
      year,
      price: parseFloat(price),
      inStock: inStock === "true" || inStock === true,
      description,
      brand: brandId ? { _type: "reference", _ref: brandId } : undefined,
      model: modelId ? { _type: "reference", _ref: modelId } : undefined,
      category: categoryId ? { _type: "reference", _ref: categoryId } : undefined,
    });

    return res.status(200).json({ sparePart: result });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create spare part", error: err });
  }
}