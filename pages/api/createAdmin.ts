// /pages/api/createAdmin.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { writeClient } from "@/lib/sanity.write";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing name, email, or password" });
  }

  try {
    const existing = await writeClient.fetch(
      `*[_type=="user" && email==$email][0]`,
      { email }
    );

    if (existing && existing.role === "admin") {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = {
      _type: "user",
      name,
      email,
      password: hashed,
      role: "admin",
    };

    await writeClient.create(newAdmin); // ✅ Use `create` not `createOrReplace`

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
}
