import { prisma } from "../utils/prisma";
import axios from "axios";
import { Gender } from "@prisma/client";

(async () => {
  console.log("INITIALIZING DB");

  console.log("CREATING TYPES");

  const types_data = (await axios.get("https://pokeapi.co/api/v2/type")).data
    .results;

  await Promise.all(
    types_data.map((td: any) => {
      return prisma.type.create({
        data: {
          id: parseInt(td.url.match(/(\d+)\/?$/)[1]),
          name: td.name,
        },
      });
    })
  );

  console.log("CREATING MOVES");

  const moves_data = (
    await axios.get("https://pokeapi.co/api/v2/move?limit=1000")
  ).data.results;

  const p_moves = await Promise.all(
    moves_data.map(async (move: any) => {
      try {
        const response = await axios.get(move.url);
        const { data } = response;

        if (!data) {
          throw new Error("No data returned from API");
        }

        if (!data.id || !data.name || !data.type?.url) {
          throw new Error(
            `Missing expected properties in API response: ${JSON.stringify(
              data
            )}`
          );
        }

        const f_move = {
          id: parseInt(data.id, 10),
          name: data.name,
          type: {
            id: parseInt(data.type.url.match(/(\d+)\/?$/)[1], 10) || 0,
          },
        };

        console.log(JSON.stringify(f_move));

        return f_move;
      } catch (err) {
        console.error(`Error processing move ${move.url}:`, err);
      }
    })
  );

  await Promise.all(
    p_moves.map((move) => {
      if (move) {
        return prisma.move.create({
          data: {
            id: move.id,
            name: move.name,
            types: { connect: { id: move.type.id ?? 1 } },
          },
        });
      }
    })
  );

  console.log("LOADING POKEMON");

  const data = (
    await axios.get("https://pokeapi.co/api/v2/pokemon?limit=107&offset=386")
  ).data.results as Array<{ name: string; url: string }>;

  let pokemons = [];

  const move_ids = await prisma.move.findMany({ select: { id: true } });

  let f_move_ids = move_ids.map((m) => m.id);

  for (const d of data) {
    const p = (await axios.get(d.url)).data;

    const pokemon = {
      id: parseInt(p.id),
      name: p.name as string,
      imageUrl: p.sprites.front_default as string,
      moves: p.moves.map(({ move }: any) => {
        const moveId = parseInt(move.url.match(/(\d+)\/?$/)[1]) as number;

        if (moveId in f_move_ids) {
          return {
            id: parseInt(move.url.match(/(\d+)\/?$/)[1]) as number,
          };
        }
      }),
      types: p.types.map(({ type }: any) => {
        return {
          id: parseInt(type.url.match(/(\d+)\/?$/)[1]) as number,
          name: type.name as string,
        };
      }) as Array<{ id: number; name: string }>,
    };

    pokemons.push(pokemon);
  }

  const moves = await prisma.move.findMany({ include: { types: true } });

  for (const p of pokemons) {
    // Filter moves to get only those matching the Pokémon's types
    const matchingMoves = moves.filter((move) =>
      move.types.some((type) => p.types.some((pType) => pType.id === type.id))
    );

    // Shuffle the matching moves array
    const shuffledMoves = matchingMoves.sort(() => 0.5 - Math.random());

    // Select the first 4 moves after shuffling
    const selectedMoves = shuffledMoves.slice(0, 4);

    await prisma.pokemon.create({
      data: {
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        moves: {
          connect: selectedMoves.map((move) => ({
            id: move.id,
          })),
        },
        type: {
          connect: p.types.map((type: any) => {
            return {
              id: type.id,
            };
          }),
        },
      },
    });
  }

  console.log("LOADING ITEMS");

  const items_data = (
    await axios.get("https://pokeapi.co/api/v2/item?limit=100")
  ).data.results;

  const p_items = await Promise.all(
    items_data.map(async (item: any) => {
      try {
        const response = await axios.get(item.url);
        const { data } = response;

        if (!data) {
          throw new Error("No data returned from API");
        }

        if (!data.id || !data.name || !data.sprites?.default) {
          throw new Error(
            `Missing expected properties in API response: ${JSON.stringify(
              data
            )}`
          );
        }

        const f_item = {
          id: parseInt(data.id, 10),
          name: data.name,
          imageUrl: data.sprites.default,
        };

        console.log(JSON.stringify(f_item));

        return f_item;
      } catch (err) {
        console.error(`Error processing item ${item.url}:`, err);
      }
    })
  );

  await Promise.all(
    p_items.map((item) => {
      if (item) {
        return prisma.item.create({
          data: {
            id: item.id,
            name: item.name,
            imageUrl: item.imageUrl,
          },
        });
      }
    })
  );

  console.log("LOADING TRAINERS");

  const pokemon = await prisma.pokemon.findMany({
    include: { type: true, moves: true },
  }); // Fetch all existing Pokémon with their types and moves
  const items = await prisma.item.findMany(); // Fetch all items

  const gymLeaders = [
    { name: "Roark", gender: Gender.MALE },
    { name: "Gardenia", gender: Gender.FEMALE },
    { name: "Maylene", gender: Gender.FEMALE },
    { name: "Crasher", gender: Gender.MALE },
    { name: "Fantina", gender: Gender.FEMALE },
    { name: "Byron", gender: Gender.MALE },
    { name: "Candice", gender: Gender.FEMALE },
    { name: "Volkner", gender: Gender.MALE },
  ];

  // Helper function to get random elements from an array
  function getRandomElements(arr: Array<any>, count: number) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  for (const leader of gymLeaders) {
    // Select 6 random Pokémon
    const selectedPokemons = getRandomElements(pokemon, 6);

    // Select 5 random items
    const selectedItems = getRandomElements(items, 5);

    console.log(JSON.stringify(selectedItems));

    await prisma.trainer.create({
      data: {
        name: leader.name,
        gender: leader.gender,
        pokemon: {
          connect: selectedPokemons.map((pokemon) => ({
            id: pokemon.id,
          })),
        },
        items: {
          connect: selectedItems.map((item) => ({
            id: item.id,
          })),
        },
      },
    });
  }

  console.log("CREATING SAMPLE BATTLES");

  const trainers = await prisma.trainer.findMany({
    include: { pokemon: true, items: true },
  });

  function getRandomTrainerPair(trainers: Array<any>): [any, any] {
    const shuffled = trainers.sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  }

  for (let i = 0; i < 15; i++) {
    const [trainer1, trainer2] = getRandomTrainerPair(trainers);

    const winner = Math.random() > 0.5 ? trainer1 : trainer2;

    await prisma.battle.create({
      data: {
        trainers: {
          connect: [{ id: trainer1.id }, { id: trainer2.id }],
        },
        winner: {
          connect: { id: winner.id },
        },
      },
    });
  }

  console.log("DONE");
})();
