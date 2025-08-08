import { writeClient } from "@/lib/sanity.write";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { name, brand, year } = req.body;
	if (!name || !brand) return res.status(400).json({ message: "Missing name or brand" });

	try {
		const doc = {
			_type: "carModel",
			name,
			brand: { _type: "reference", _ref: brand },
			year,
		};
		const created = await writeClient.create(doc);
		res.status(200).json(created);
	} catch (err) {
		res.status(500).json({ message: "Error creating model" });
	}
}
