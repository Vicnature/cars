// ✅ CORRECT DELETE HANDLER
import { writeClient } from "@/lib/sanity.write";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;
	if (!id || typeof id !== "string")
		return res.status(400).json({ message: "Missing ID" });

	try {
		await writeClient.delete(id);
		res.status(200).json({ success: true });
	} catch (err) {
		console.error("Delete error:", err);
		res.status(500).json({ message: "Error deleting model" });
	}
}
