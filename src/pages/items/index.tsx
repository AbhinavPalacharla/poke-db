import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

import type { NextPageWithLayout } from "@/components/layout";
import { Item as ItemT } from "@prisma/client";

const Item: React.FC<ItemT> = ({ id, name, imageUrl }) => {
  return (
    <button className="flex flex-col items-center gap-y-2 border-[1px] border-[#282828] rounded-lg p-2">
      <Image
        src={imageUrl}
        alt={`${name} image`}
        height={100}
        width={100}
        className="h-12 w-12"
      />
      <h1 className="capitalize">{name}</h1>
    </button>
  );
};

const Page: NextPageWithLayout = (props: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const data = (await axios.get("/api/item/new.get.items"))
        .data as Array<ItemT>;

      return data;
    },
  });

  return data ? (
    <div>
      <div className="mt-8 pb-36 grid grid-cols-9 gap-4">
        {data.map((p) => (
          <Item key={p.id} id={p.id} imageUrl={p.imageUrl} name={p.name} />
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
