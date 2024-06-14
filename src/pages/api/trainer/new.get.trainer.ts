import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import {
  Trainer,
  Pokemon,
  Move,
  Type,
  Item,
  _PokemonToTrainer,
  _MoveToPokemon,
  _PokemonToType,
  _ItemToTrainer,
} from "@/drizzle/schema";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id || isNaN(parseInt(id as string))) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const trainerId = parseInt(id as string);

  try {
    // Fetch the trainer with Pokémon, their moves, and types
    const trainerResult = await db
      .select({
        trainer: Trainer,
        pokemon: Pokemon,
        move: Move,
        type: Type,
        item: Item,
      })
      .from(Trainer)
      .leftJoin(_PokemonToTrainer, eq(Trainer.id, _PokemonToTrainer.B))
      .leftJoin(Pokemon, eq(_PokemonToTrainer.A, Pokemon.id))
      .leftJoin(_MoveToPokemon, eq(Pokemon.id, _MoveToPokemon.B))
      .leftJoin(Move, eq(_MoveToPokemon.A, Move.id))
      .leftJoin(_PokemonToType, eq(Pokemon.id, _PokemonToType.A))
      .leftJoin(Type, eq(_PokemonToType.B, Type.id))
      .leftJoin(_ItemToTrainer, eq(Trainer.id, _ItemToTrainer.B))
      .leftJoin(Item, eq(_ItemToTrainer.A, Item.id))
      .where(eq(Trainer.id, trainerId))
      .execute();

    if (!trainerResult.length) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Process and format the results
    const trainer = trainerResult.reduce(
      (acc, row) => {
        if (!acc.id) {
          acc = { ...row.trainer, pokemon: [], items: [] };
        }

        let pokemon = acc.pokemon.find((p: any) => p.id === row.pokemon?.id);
        if (!pokemon && row.pokemon) {
          pokemon = { ...row.pokemon, moves: [], types: [] };
          acc.pokemon.push(pokemon);
        }

        if (
          row.move &&
          pokemon &&
          !pokemon.moves.some((m: any) => m.id === row.move!.id)
        ) {
          pokemon.moves.push(row.move);
        }

        if (
          row.type &&
          pokemon &&
          !pokemon.types.some((t: any) => t.id === row.type!.id)
        ) {
          pokemon.types.push(row.type);
        }

        if (row.item && !acc.items.some((i: any) => i.id === row.item!.id)) {
          acc.items.push(row.item);
        }

        return acc;
      },
      {
        id: 0,
        name: "",
        gender: "",
        imageUrl: "",
        pokemon: [],
        items: [],
      } as any
    );

    return res.status(200).json(trainer);
  } catch (err) {
    // handleError(err, res);
    return res.status(500).json(err);
  }
};

export default handler;
