import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { writeClient } from "@/lib/sanity.write";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const existingUser = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await writeClient.create({
      _type: "user",
      name,
      email,
      password: hashedPassword,
      role: "customer", // default role
    });

    return res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
