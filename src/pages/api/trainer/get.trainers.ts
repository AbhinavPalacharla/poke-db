import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { Trainer, Pokemon, _PokemonToTrainer } from "@/drizzle/schema";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch trainers and their associated Pokémon
    const trainerResults = await db
      .select({
        trainer: Trainer,
        pokemon: Pokemon,
      })
      .from(Trainer)
      .leftJoin(_PokemonToTrainer, eq(Trainer.id, _PokemonToTrainer.B))
      .leftJoin(Pokemon, eq(_PokemonToTrainer.A, Pokemon.id))
      .execute();

    // Process and format the results
    const trainers = trainerResults.reduce((acc, row) => {
      let trainer = acc.find((t) => t.id === row.trainer.id);
      if (!trainer) {
        trainer = { ...row.trainer, pokemon: [] };
        acc.push(trainer);
      }
      if (
        row.pokemon &&
        !trainer.pokemon.some((p) => p.id === row.pokemon!.id)
      ) {
        trainer.pokemon.push(row.pokemon);
      }
      return acc;
    }, [] as Array<{ id: number; name: string; gender: string; imageUrl: string; pokemon: Array<{ id: number; name: string; imageUrl: string }> }>);

    return res.status(200).json(trainers);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
