import { writeClient } from "@/lib/sanity.write";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ message: "Missing ID" });

  await writeClient.delete(id);
  res.status(200).json({ success: true });
}
