// /pages/api/brands/list.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "@/lib/sanity.client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const brands = await sanityClient.fetch(`*[_type == "brand"] | order(name asc)`);
		res.status(200).json({ brands });
	} catch (error) {
		console.error("Error fetching brands:", error);
		res.status(500).json({ message: "Failed to fetch brands" });
	}
}
