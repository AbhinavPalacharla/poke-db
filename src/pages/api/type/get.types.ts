import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const types = await prisma.type.findMany();

    return res.status(200).json(types);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
