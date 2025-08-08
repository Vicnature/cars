import { writeClient } from "@/lib/sanity.write";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).end();

	const { name, description } = req.body;
	if (!name) return res.status(400).json({ message: "Name is required" });

	try {
		const doc = { _type: "category", name, description };
		const created = await writeClient.create(doc);
		res.status(200).json(created);
	} catch (err) {
		res.status(500).json({ message: "Error creating category" });
	}
}
