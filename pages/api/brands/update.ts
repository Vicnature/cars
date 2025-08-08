import { NextApiRequest, NextApiResponse } from "next";
import { writeClient } from "@/lib/sanity.write";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "PUT") return res.status(405).end();

	const { id } = req.query;
	const { name } = req.body;

	if (!id || typeof id !== "string" || !name) {
		return res.status(400).json({ message: "Missing ID or name" });
	}

	try {
		await writeClient.patch(id).set({ name }).commit();
		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Brand update error:", error);
		res.status(500).json({ message: "Server error" });
	}
}
