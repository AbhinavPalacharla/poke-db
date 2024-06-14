import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

import type { NextPageWithLayout } from "@/components/layout";
import { Move, Pokemon as PokemonT, Type } from "@prisma/client";

const Pokemon: React.FC<PokemonT & { type: Array<Type> }> = ({
  id,
  name,
  imageUrl,
  type,
}) => {
  const router = useRouter();

  return (
    <button
      className="flex flex-col items-center gap-y-2 border-[1px] border-[#282828] rounded-lg p-2"
      onClick={() => router.push(`/pokemon/${id}`)}
    >
      <Image
        src={imageUrl}
        alt={`${name} image`}
        height={100}
        width={100}
        className="h-24 w-24"
      />
      <h1 className="capitalize">{name}</h1>
      <div className="flex flex-row items-center gap-x-2">
        {type.map((t) => (
          <div
            key={t.id}
            className="border-[1.5px] border-[#282828] rounded-md px-2 py-0.5"
          >
            <h1 className="text-xs capitalize">{t.name}</h1>
          </div>
        ))}
      </div>
    </button>
  );
};

const Page: NextPageWithLayout = (props: any) => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["pokemon"],
    queryFn: async () => {
      const data = (
        await axios.get("/api/pokemon/get.pokemon", {
          params: { id: router.query.id },
        })
      ).data as PokemonT & {
        types: Array<Type>;
        moves: Array<Move & { types: Array<Type> }>;
      };

      return data;
    },
  });

  return data ? (
    <div>
      <div className="flex flex-row items-center gap-x-4">
        <Image
          src={data.imageUrl}
          alt={`${name} image`}
          height={100}
          width={100}
          className="h-36 w-36 lg:-ml-16"
        />
        <h1 className="capitalize text-3xl font-semibold">{data.name}</h1>
      </div>
      <div className="flex flex-row items-center gap-x-4 mt-8">
        <h1 className="underline">TYPES</h1>
        <div className="flex flex-row items-center gap-x-2">
          {data.types.map((t) => (
            <div
              key={t.id}
              className="border-[1.5px] border-[#282828] rounded-md px-2 py-0.5"
            >
              <h1 className="text-sm capitalize">{t.name}</h1>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h1 className="underline">MOVES</h1>
        <div className="ml-8">
          {data.moves.map((m) => (
            <div key={m.id} className="flex flex-row gap-x-4 mt-4">
              <h1>{m.name}</h1>
              {m.types.map((t) => (
                <div
                  key={t.id}
                  className="border-[1.5px] border-[#282828] rounded-md px-2 py-0.5"
                >
                  <h1 className="text-sm capitalize">{t.name}</h1>
                </div>
              ))}
            </div>
          ))}
        </div>
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
