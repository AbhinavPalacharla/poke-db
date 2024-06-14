import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Male, Female } from "iconoir-react";
import axios from "axios";
import Image from "next/image";

import type { NextPageWithLayout } from "@/components/layout";
import {
  Gender,
  Item as ItemT,
  Move,
  Pokemon as PokemonT,
  Trainer,
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

const Page: NextPageWithLayout = (props: any) => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const data = (
        await axios.get("/api/trainer/get.trainer", {
          params: { id: router.query.id },
        })
      ).data as Trainer & {
        items: Array<ItemT>;
        pokemon: Array<PokemonT & { moves: Array<Move>; type: Type }>;
      };

      // console.log(data);

      return data;
    },
  });

  return data ? (
    <div>
      {/* <h1>{JSON.stringify(data)}</h1> */}
      <div className="flex flex-row gap-x-2 items-center mt-24">
        <Image
          height={40}
          width={40}
          src={`/trainers/${data.imageUrl}`}
          alt={data.imageUrl}
          className="mr-8"
        />
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        {data.gender == Gender.MALE ? (
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
      </div>
      <h1 className="mt-8 underline">PARTY</h1>
      <div className="flex flex-row items-center">
        {data.pokemon.map((p) => (
          <Pokemon key={p.id} id={p.id} name={p.name} imageUrl={p.imageUrl} />
        ))}
      </div>
      <h1 className="mt-8 underline">ITEMS</h1>
      <div className="mt-8">
        {data.items.map((it) => (
          <Item key={it.id} id={it.id} name={it.name} imageUrl={it.imageUrl} />
        ))}
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
