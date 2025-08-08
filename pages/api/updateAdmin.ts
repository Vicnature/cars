import { writeClient } from "@/lib/sanity.write";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, email, password } = req.body;
  if (!id || !name || !email) return res.status(400).json({ message: "Missing fields" });

  const update: any = { name, email };
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    update.password = hashed;
  }

  await writeClient.patch(id).set(update).commit();
  res.status(200).json({ success: true });
}
