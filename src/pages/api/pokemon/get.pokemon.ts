import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const pokemon = await prisma.pokemon.findUnique({
      where: {
        id: parseInt(id as string),
      },
      include: {
        type: true,
        moves: {
          include: { types: true },
        },
      },
    });

    return res.status(200).json(pokemon);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
