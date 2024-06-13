import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        pokemon: true,
      },
    });

    return res.status(200).json(trainers);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
