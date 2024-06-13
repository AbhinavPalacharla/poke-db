import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { typeId } = req.query;

    if (parseInt(typeId as string)) {
      console.log(`TYPE ID: ${typeId}`);

      const pokemon = await prisma.pokemon.findMany({
        where: {
          type: {
            some: {
              id: parseInt(typeId as string),
            },
          },
        },
        include: { type: true },
      });

      console.log(`POKEMON: ${pokemon}`);

      return res.status(200).json(pokemon);
    }

    const pokemon = await prisma.pokemon.findMany({
      include: { type: true },
    });

    return res.status(200).json(pokemon);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
