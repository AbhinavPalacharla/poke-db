import Image from "next/image";
import CurateMiniLogo from "/public/curate-mini.svg";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({
  weight: "variable",
  subsets: ["latin"],
});

const Footer: React.FC = () => {
  return (
    <div className="flex flex-row items-center">
      <div className="w-[1%] bg-black/80 backdrop-blur-md" />
      <div className="w-[98%] invisible lg:visible flex flex-row justify-between px-2 lg:px-8 py-4 mt-8 border-t-[1px] border-[#282828] bg-black/80 backdrop-blur-md">
        <div className="flex flex-row gap-x-3 items-center">
          <div className="flex flex-row gap-x-2 items-center text-xs">
            <h1 className="text-white">PokeDB</h1>
            <h1
              className={`text-[#969696] inline-block align-text-middle ${robotoMono.className}`}
            >
              — v1.0.0
            </h1>
          </div>
        </div>
        <h1 className="text-[#969696] text-xs italic">By Abhinav Palacharla</h1>
      </div>
      <div className="w-[1%] bg-black/80 backdrop-blur-md" />
    </div>
  );
};

export { Footer };
