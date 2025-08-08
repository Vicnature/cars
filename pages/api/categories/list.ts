// /pages/api/categories/list.ts

import { sanityClient } from "@/lib/sanity.client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const categories = await sanityClient.fetch(`
			*[_type == "category"] | order(name asc)
		`);
		res.status(200).json({ categories });
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		res.status(500).json({ message: "Error fetching categories" });
	}
}
