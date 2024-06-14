import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import {
  Battle,
  Trainer,
  Pokemon,
  Item,
  _PokemonToTrainer,
  _ItemToTrainer,
  _BattleToTrainer,
} from "@/drizzle/schema";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    if (!id || isNaN(parseInt(id as string))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const battleId = parseInt(id as string);

    // Fetch the winner details
    const winnerResult = await db
      .select({
        winner: Trainer,
      })
      .from(Battle)
      .leftJoin(Trainer, eq(Battle.trainerId, Trainer.id))
      .where(eq(Battle.id, battleId))
      .execute();

    // Fetch the battle details along with trainers, Pokémon, and items
    const battleResult = await db
      .select({
        battle: Battle,
        trainer: Trainer,
        pokemon: Pokemon,
        item: Item,
      })
      .from(Battle)
      .leftJoin(_BattleToTrainer, eq(Battle.id, _BattleToTrainer.A))
      .leftJoin(Trainer, eq(_BattleToTrainer.B, Trainer.id))
      .leftJoin(_PokemonToTrainer, eq(Trainer.id, _PokemonToTrainer.B))
      .leftJoin(Pokemon, eq(_PokemonToTrainer.A, Pokemon.id))
      .leftJoin(_ItemToTrainer, eq(Trainer.id, _ItemToTrainer.B))
      .leftJoin(Item, eq(_ItemToTrainer.A, Item.id))
      .where(eq(Battle.id, battleId))
      .execute();

    if (!battleResult.length) {
      return res.status(404).json({ error: "Battle not found" });
    }

    // Extract the winner information
    const winner = winnerResult.length ? winnerResult[0].winner : null;

    // Process and format the results
    const battle = battleResult.reduce(
      (acc, row) => {
        if (!acc.id) {
          acc = { ...row.battle, winner, trainers: [] };
        }
        let trainer = acc.trainers.find((t: any) => t.id === row.trainer!.id);
        if (!trainer) {
          trainer = { ...row.trainer, pokemon: [], items: [] };
          acc.trainers.push(trainer);
        }
        if (
          row.pokemon &&
          !trainer.pokemon.some((p: any) => p.id === row.pokemon!.id)
        ) {
          trainer.pokemon.push(row.pokemon);
        }
        if (
          row.item &&
          !trainer.items.some((i: any) => i.id === row.item!.id)
        ) {
          trainer.items.push(row.item);
        }
        return acc;
      },
      { id: 0, trainers: [] } as any
    );

    return res.status(200).json(battle);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
