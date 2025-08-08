import { writeClient } from "@/lib/sanity.write";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	if (req.method !== "PUT" || typeof id !== "string")
		return res.status(400).json({ message: "Invalid request" });

	const { name, description } = req.body;

	try {
		const updated = await writeClient
			.patch(id)
			.set({ name, description })
			.commit();
		res.status(200).json(updated);
	} catch (err) {
		res.status(500).json({ message: "Error updating category" });
	}
}
