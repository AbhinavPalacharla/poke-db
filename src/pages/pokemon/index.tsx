import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

import type { NextPageWithLayout } from "@/components/layout";
import { Pokemon as PokemonT, Type } from "@prisma/client";
import { useState } from "react";

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
        {type?.map((t) => (
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
  const [typeId, setTypeId] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["pokemon", typeId],
    queryFn: async () => {
      const data = (
        await axios.get("/api/pokemon/get.pokemons", {
          params: { typeId: typeId },
        })
      ).data as Array<PokemonT & { types: Array<Type> }>;

      return data;
    },
  });

  const { data: typesData } = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const data = (await axios.get("/api/type/get.types")).data as Array<Type>;

      return data;
    },
  });

  // return data && <h1>{JSON.stringify(data)}</h1>;

  return data && typesData ? (
    <div>
      {/* {JSON.stringify(data)} */}
      <div className="mt-8">
        {/* <h1>{typeId}</h1> */}
        <div className="flex flex-row items-center gap-x-4">
          <h1 className="underline">Filter By Type</h1>
          {typeId != 0 && (
            <button
              className="px-1.5 py-0.5 border-[1px] border-[#282828] rounded-md hover:bg-white hover:text-black"
              onClick={() => {
                setTypeId(0);
              }}
            >
              Clear Selection
            </button>
          )}
        </div>
        <div className="mt-4 w-[100%] flex flex-row items-ceter gap-x-2 overflow-scroll no-scrollbar">
          {typesData.map((t) =>
            typeId == t.id ? (
              <button
                key={t.id}
                className="border-[1.5px] border-[#282828] rounded-md px-2 py-0.5 bg-white"
                onClick={() => {
                  setTypeId(0);
                }}
              >
                <h1 className="text-sm capitalize text-black">{t.name}</h1>
              </button>
            ) : (
              <button
                key={t.id}
                className="border-[1.5px] border-[#282828] rounded-md px-2 py-0.5"
                onClick={() => {
                  setTypeId(t.id);
                }}
              >
                <h1 className="text-sm capitalize">{t.name}</h1>
              </button>
            )
          )}
        </div>
      </div>
      <div className="mt-8 pb-36 grid grid-cols-7 gap-4">
        {data.map((p) => (
          <Pokemon
            key={p.id}
            id={p.id}
            imageUrl={p.imageUrl}
            name={p.name}
            type={p.types}
          />
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
