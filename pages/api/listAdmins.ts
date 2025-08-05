import { NextApiResponse } from "next";
import { writeClient } from "@/lib/sanity.write";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admins = await writeClient.fetch(`*[_type=="user" && role=="admin"]{_id,name,email}`);
  res.status(200).json({ admins });
}
