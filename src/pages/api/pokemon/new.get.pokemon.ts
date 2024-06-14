import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import {
  Pokemon,
  Type as PokemonType,
  _PokemonToType,
  _MoveToPokemon,
  Move,
  _MoveToType,
  Type as MoveType,
} from "@/drizzle/schema";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    if (!id || isNaN(parseInt(id as string))) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const pokemonId = parseInt(id as string);

    // Fetch the Pokémon details with their types
    const pokemonWithTypes = await db
      .select({
        pokemon: Pokemon,
        type: PokemonType,
      })
      .from(Pokemon)
      .leftJoin(_PokemonToType, eq(Pokemon.id, _PokemonToType.A))
      .leftJoin(PokemonType, eq(_PokemonToType.B, PokemonType.id))
      .where(eq(Pokemon.id, pokemonId))
      .execute();

    // Fetch the Pokémon moves with their types
    const pokemonMovesWithTypes = await db
      .select({
        pokemon: Pokemon,
        move: Move,
        moveType: MoveType,
      })
      .from(Pokemon)
      .leftJoin(_MoveToPokemon, eq(Pokemon.id, _MoveToPokemon.B))
      .leftJoin(Move, eq(_MoveToPokemon.A, Move.id))
      .leftJoin(_MoveToType, eq(Move.id, _MoveToType.A))
      .leftJoin(MoveType, eq(_MoveToType.B, MoveType.id))
      .where(eq(Pokemon.id, pokemonId))
      .execute();

    if (!pokemonWithTypes.length && !pokemonMovesWithTypes.length) {
      return res.status(404).json({ error: "Pokémon not found" });
    }

    // Process and format the results
    const pokemon = pokemonWithTypes.reduce(
      (acc, row) => {
        if (!acc.id) {
          acc = { ...row.pokemon, types: [], moves: [] };
        }
        if (row.type && !acc.types.some((t: any) => t.id === row.type!.id)) {
          acc.types.push(row.type);
        }
        return acc;
      },
      { id: 0, name: "", imageUrl: "", types: [], moves: [] } as any
    );

    pokemon.moves = pokemonMovesWithTypes.reduce((acc, row) => {
      if (row.move) {
        let move = acc.find((m) => m.id === row.move!.id);
        if (!move) {
          move = { ...row.move, types: [] };
          acc.push(move);
        }
        if (
          row.moveType &&
          !move.types.some((mt: any) => mt.id === row.moveType!.id)
        ) {
          move.types.push(row.moveType);
        }
      }
      return acc;
    }, [] as any[]);

    return res.status(200).json(pokemon);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
