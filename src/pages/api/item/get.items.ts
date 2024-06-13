import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const items = await prisma.item.findMany();

    return res.status(200).json(items);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
