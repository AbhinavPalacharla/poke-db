import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { Male, Female, Trophy } from "iconoir-react";

import type { NextPageWithLayout } from "@/components/layout";
import { Battle as BattleT, Trainer as TrainerT, Gender } from "@prisma/client";

const Trainer: React.FC<TrainerT> = ({ id, name, gender, imageUrl }) => {
  return (
    <div className="flex flex-row gap-x-2 items-center">
      <Image
        height={40}
        width={40}
        src={`/trainers/${imageUrl}`}
        alt={imageUrl}
        className="mr-2"
      />
      <h1 className="text-xl font-semibold">{name}</h1>
    </div>
  );
};

const Battle: React.FC<
  Omit<BattleT & { trainers: Array<TrainerT>; winner: TrainerT }, "trainerId">
> = ({ id, trainers, winner }) => {
  const router = useRouter();

  return (
    <button
      className="border-[1px] border-[#282828] rounded-lg p-4 mt-4 w-96"
      onClick={() => {
        router.push(`/battles/${id}`);
      }}
    >
      <div className="flex flex-row items-center gap-x-8">
        <div className="flex flex-row gap-x-2">
          {/* {winner.id == trainers[0].id ? (
            <Trophy
              className="text-yellow-400"
              strokeWidth={2.5}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          ) : (
            <></>
          )} */}
          <Trainer
            id={trainers[0].id}
            gender={trainers[0].gender}
            name={trainers[0].name}
            imageUrl={trainers[0].imageUrl}
          />
        </div>
        <h1 className="text-[#969696] italic">VS</h1>
        <div className="flex flex-row gap-x-2">
          {/* {winner.id == trainers[1].id ? (
            <Trophy
              className="text-yellow-400"
              strokeWidth={2.5}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          ) : (
            <></>
          )} */}
          <Trainer
            id={trainers[1].id}
            gender={trainers[1].gender}
            name={trainers[1].name}
            imageUrl={trainers[1].imageUrl}
          />
        </div>
      </div>
    </button>
  );
};

const Page: NextPageWithLayout = (props: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const data = (await axios.get("/api/battle/get.battles")).data as Array<
        BattleT & { trainers: Array<TrainerT>; winner: TrainerT }
      >;

      return data;
    },
  });

  return data ? (
    <div>
      <div className="mt-24 grid sm:grid-cols-1 lg:grid-cols-3 pb-24">
        {data.map((b) => (
          <Battle
            key={b.id}
            id={b.id}
            trainers={b.trainers}
            winner={b.winner}
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
