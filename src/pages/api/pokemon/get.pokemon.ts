import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const pokemon = await prisma.pokemon.findMany({
      include: { type: true },
    });

    return res.status(200).json(pokemon);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
