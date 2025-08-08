// /pages/api/models/list.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "@/lib/sanity.client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const models = await sanityClient.fetch(`
			*[_type == "carModel"]{
				...,
				"brand": brand->_id,
				"brandName": brand->name
			} | order(name asc)
		`);
		res.status(200).json({ models });
	} catch (error) {
		console.error("Error fetching models:", error);
		res.status(500).json({ message: "Failed to fetch models" });
	}
}
