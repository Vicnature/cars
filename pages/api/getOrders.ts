import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { writeClient } from "@/lib/sanity.write";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { email } = req.query;

const query = `*[_type == "order" && email == $email]|order(_createdAt desc){
  _id,
  _createdAt,
  part->{title},
  quantity,
  location,
  status
}`;
    const orders = await writeClient.fetch(query, { email });


    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
}
