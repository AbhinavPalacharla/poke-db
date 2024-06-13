import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

import type { NextPageWithLayout } from "@/components/layout";
import { Pokemon as PokemonT, Type } from "@prisma/client";

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
    queryKey: ["trainers"],
    queryFn: async () => {
      const data = (await axios.get("/api/pokemon/get.pokemons")).data as Array<
        PokemonT & { type: Array<Type> }
      >;

      return data;
    },
  });

  return data ? (
    <div>
      <div className="mt-8 pb-36 grid grid-cols-7 gap-4">
        {data.map((p) => (
          <Pokemon
            key={p.id}
            id={p.id}
            imageUrl={p.imageUrl}
            name={p.name}
            type={p.type}
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
