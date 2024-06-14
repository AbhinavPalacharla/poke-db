import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { Pokemon, Type, _PokemonToType } from "@/drizzle/schema";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    interface Pokemon {
      id: number;
      name: string;
      imageUrl: string;
    }

    interface Type {
      id: number;
      name: string;
    }

    interface PokemonWithTypes extends Pokemon {
      types: Type[];
    }

    const { typeId } = req.query;

    const pokemonWithTypes = await db
      .select({
        pokemon: Pokemon,
        type: Type,
      })
      .from(Pokemon)
      .leftJoin(_PokemonToType, eq(Pokemon.id, _PokemonToType.A))
      .leftJoin(Type, eq(_PokemonToType.B, Type.id))
      .execute();

    const result = pokemonWithTypes.reduce<Record<number, PokemonWithTypes>>(
      (acc, row) => {
        const { pokemon, type } = row;
        if (!acc[pokemon.id]) {
          acc[pokemon.id] = { ...pokemon, types: [] };
        }
        if (type) {
          acc[pokemon.id].types.push(type);
        }
        return acc;
      },
      {}
    );

    let pokemonArray = Object.values(result);

    if (parseInt(typeId as string)) {
      pokemonArray = pokemonArray.filter((pokemon) =>
        pokemon.types.some((type) => type.id === Number(typeId))
      );
    }

    return res.status(200).json(pokemonArray);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default handler;
