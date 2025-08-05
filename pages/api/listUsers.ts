import { NextApiResponse } from "next";
import { writeClient } from "@/lib/sanity.write";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = await writeClient.fetch(`*[_type=="user" && role=="customer"]{_id,name,email}`);
  res.status(200).json({ users });
}
