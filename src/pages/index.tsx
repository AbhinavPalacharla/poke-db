import type { NextPageWithLayout } from "@/components/layout";
import Image from "next/image";

const Page: NextPageWithLayout = (props: any) => {
  return (
    <>
      <Image
        height={100}
        width={100}
        src={"/trainers/roark.png"}
        alt="roark.png"
      />
    </>
  );
};

Page.footer = true;

export default Page;
