import { writeClient } from "@/lib/sanity.write";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, email } = req.body;
  if (!id || !name || !email) return res.status(400).json({ message: "Missing fields" });

  const updated = await writeClient.patch(id).set({ name, email }).commit();
  res.status(200).json(updated);
}
