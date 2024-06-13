import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const battles = await prisma.battle.findMany({
      include: {
        trainers: true,
        winner: true,
      },
    });

    return res.status(200).json(battles);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
