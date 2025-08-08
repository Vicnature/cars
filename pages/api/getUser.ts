// pages/api/getUser.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { writeClient } from "@/lib/sanity.write";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await writeClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error in /api/getUser:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
