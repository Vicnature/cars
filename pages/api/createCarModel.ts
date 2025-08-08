import { sanityClient } from "@/lib/sanity.client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { name, brandId, year } = req.body;
  if (!name || !brandId) return res.status(400).json({ message: "Model name and brand are required" });

  try {
    const result = await sanityClient.create({
      _type: "carModel",
      name,
      year: year ? parseInt(year) : null,
      brand: { _type: "reference", _ref: brandId },
    });
    return res.status(200).json({ model: result });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create model", error: err });
  }
}