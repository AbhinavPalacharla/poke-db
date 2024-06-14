import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/drizzle/db";
import { Item } from "@/drizzle/schema";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch all items
    const items = await db.select().from(Item).execute();

    return res.status(200).json(items);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
