// /pages/api/spareParts/list.ts
import { sanityClient } from "@/lib/sanity.client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const parts = await sanityClient.fetch(`
			*[_type == "sparePart"] | order(_createdAt desc) {
				_id,
				title,
				price,
				"category": category->{name},
				// other fields like brand/model if needed
			}
		`);
		res.status(200).json({ parts });
	} catch (error) {
		console.error("Failed to fetch parts:", error);
		res.status(500).json({ message: "Error fetching spare parts" });
	}
}
