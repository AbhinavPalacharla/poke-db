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
  Trainer as TrainerT,
  Type,
} from "@prisma/client";

const Trainer: React.FC<TrainerT> = ({ id, name, gender, imageUrl }) => {
  const router = useRouter();
  return (
    <button
      className="flex flex-row gap-x-2 items-center mt-8"
      onClick={() => {
        router.push(`/trainers/${id}`);
      }}
    >
      <Image
        height={40}
        width={40}
        src={`/trainers/${imageUrl}`}
        alt={imageUrl}
        className="mr-8"
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
    </button>
  );
};

const Page: NextPageWithLayout = (props: any) => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const data = (
        await axios.get("/api/trainer/get.trainers", {
          params: { id: router.query.id },
        })
      ).data as Array<
        TrainerT & {
          pokemon: Array<PokemonT>;
        }
      >;

      // console.log(data);

      return data;
    },
  });

  return data ? (
    <div className="flex flex-row justify-center mt-24">
      {/* <h1>{JSON.stringify(data)}</h1> */}
      <div className="flex-col">
        {data.map((t) => (
          <Trainer
            key={t.id}
            id={t.id}
            gender={t.gender}
            name={t.name}
            imageUrl={t.imageUrl}
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
