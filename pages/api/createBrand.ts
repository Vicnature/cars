import { NextApiRequest, NextApiResponse } from "next";
import { writeClient } from "@/lib/sanity.write";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).end();

	const { name } = req.body;
	if (!name) return res.status(400).json({ message: "Missing name" });

	try {
		const newBrand = {
			_type: "brand",
			name,
		};

		await writeClient.create(newBrand);
		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Brand create error:", error);
		res.status(500).json({ message: "Server error" });
	}
}
