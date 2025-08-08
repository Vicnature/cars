import { sanityClient } from "@/lib/sanity.client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Category name is required" });

  try {
    const result = await sanityClient.create({
      _type: "category",
      name,
      description: description || "",
    });
    return res.status(200).json({ category: result });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create category", error: err });
  }
}