import { db } from "@/drizzle/db";
import { Pokemon, Type } from "@/drizzle/schema";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const pokemon = await db
    //   .select({
    //     Pokemon,
    //   })
    //   .from(Pokemon);
    // console.log(`POKEMON: ${pokemon}`);
    // return res.status(200).json(pokemon);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default handler;
