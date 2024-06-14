import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Male, Female, Trophy } from "iconoir-react";
import axios from "axios";
import Image from "next/image";

import type { NextPageWithLayout } from "@/components/layout";
import {
  Gender,
  Item as ItemT,
  Move,
  Pokemon as PokemonT,
  Trainer as TrainerT,
  Battle,
  Type,
} from "@prisma/client";

const Pokemon: React.FC<PokemonT> = ({ id, imageUrl, name }) => {
  return (
    <Image
      src={imageUrl}
      alt={`${name} image`}
      height={100}
      width={100}
      className="h-24 w-24"
    />
  );
};

const Item: React.FC<ItemT> = ({ id, imageUrl, name }) => {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <Image
        src={imageUrl}
        alt={`${name} image`}
        height={100}
        width={100}
        className="h-8 w-8"
      />
      <h1>{name}</h1>
    </div>
  );
};

const Trainer: React.FC<
  TrainerT & {
    items: Array<ItemT>;
    pokemon: Array<PokemonT & { moves: Array<Move>; type: Type }>;
    winner: boolean;
  }
> = ({ name, gender, pokemon, items, winner, imageUrl }) => {
  return (
    <div>
      <div className="flex flex-row gap-x-2 items-center mt-24">
        <Image
          height={40}
          width={40}
          src={`/trainers/${imageUrl}`}
          alt={imageUrl}
          className="mr-2"
        />
        <h1 className="text-2xl font-semibold">{name}</h1>
        {gender == Gender.MALE ? (
          <Male
            className="text-blue-400"
            strokeWidth={2.5}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        ) : (
          <Female
            className="text-red-400"
            strokeWidth={2.5}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        )}
        {winner && (
          <Trophy
            className="text-yellow-400"
            strokeWidth={2.5}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        )}
      </div>
      <h1 className="mt-8 underline">PARTY</h1>
      <div className="grid grid-cols-2">
        {pokemon.map((p) => (
          <Pokemon key={p.id} id={p.id} name={p.name} imageUrl={p.imageUrl} />
        ))}
      </div>
      <h1 className="mt-8 underline">ITEMS</h1>
      <div className="mt-8">
        {items.map((it) => (
          <Item key={it.id} id={it.id} name={it.name} imageUrl={it.imageUrl} />
        ))}
      </div>
    </div>
  );
};

const Page: NextPageWithLayout = (props: any) => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["battles"],
    queryFn: async () => {
      const data = (
        await axios.get("/api/battle/get.battle", {
          params: { id: router.query.id },
        })
      ).data as Battle & {
        winner: TrainerT;
        trainers: Array<
          TrainerT & {
            items: Array<ItemT>;
            pokemon: Array<PokemonT & { moves: Array<Move>; type: Type }>;
          }
        >;
      };

      return data;
    },
  });

  return data ? (
    <div className="flex flex-row justify-center">
      <div className="flex flex-row items-center justify-between w-[70%]">
        <Trainer
          id={data.trainers[0].id}
          gender={data.trainers[0].gender}
          name={data.trainers[0].name}
          pokemon={data.trainers[0].pokemon}
          items={data.trainers[0].items}
          imageUrl={data.trainers[0].imageUrl}
          winner={data.trainers[0].id == data.winner.id}
        />
        <Trainer
          id={data.trainers[1].id}
          gender={data.trainers[1].gender}
          name={data.trainers[1].name}
          pokemon={data.trainers[1].pokemon}
          items={data.trainers[1].items}
          imageUrl={data.trainers[1].imageUrl}
          winner={data.trainers[1].id == data.winner.id}
        />
      </div>
    </div>
  ) : (
    <div>
      <h1>Loading...</h1>
    </div>
  );
};

Page.footer = true;

export default Page;
