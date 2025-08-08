import { writeClient } from "@/lib/sanity.write";
import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "@/lib/sanity.client"; // your read client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query;

	if (!id || typeof id !== "string") {
		return res.status(400).json({ message: "Missing ID" });
	}

	try {
		// Check for documents that reference this model
		const refs = await sanityClient.fetch(`*[_type == "sparePart" && references($id)][0]._id`, {
			id,
		});

		if (refs) {
			return res.status(409).json({
				message: "Cannot delete: This model is being used by one or more spare parts.",
			});
		}

		await writeClient.delete(id);
		res.status(200).json({ success: true });
	} catch (err) {
		console.error("Delete error:", err);
		res.status(500).json({ message: "Error deleting model" });
	}
}
