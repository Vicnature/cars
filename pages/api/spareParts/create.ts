// pages/api/spareParts/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { writeClient } from "@/lib/sanity.write";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const {
			title,
            slug,
			brandId,
			modelId,
			categoryId,
			year,
			price,
			inStock,
			description,
		} = req.body;

		// if (!title || !categoryId || !price) {
		// 	return res.status(400).json({ message: "Missing required fields" });
		// }

		const doc = {
			_type: "sparePart",
			title,
            slug,
			brand: brandId ? { _type: "reference", _ref: brandId } : undefined,
			model: modelId ? { _type: "reference", _ref: modelId } : undefined,
			category: { _type: "reference", _ref: categoryId },
			year,
			price,
			inStock,
			description,
		};

		const created = await writeClient.create(doc);

		return res.status(201).json({ message: "Created", data: created });
	} catch (error) {
		console.error("Create error:", error);
		return res.status(500).json({ message: "Server error" });
	}
}
