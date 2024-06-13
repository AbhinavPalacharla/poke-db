import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const battle = await prisma.battle.findUnique({
      where: {
        id: parseInt(id as string),
      },
      include: {
        winner: true,
        trainers: {
          include: {
            pokemon: true,
            items: true,
          },
        },
      },
    });

    return res.status(200).json(battle);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
