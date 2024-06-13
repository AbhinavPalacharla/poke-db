import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const trainers = await prisma.trainer.findUnique({
      where: {
        id: parseInt(id as string),
      },
      include: {
        pokemon: {
          include: { moves: true, type: true },
        },
        items: true,
      },
    });

    return res.status(200).json(trainers);
  } catch (err) {
    // handleError(err, res);
    return res.status(500).json(err);
  }
};

export default handler;
