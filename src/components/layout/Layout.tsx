import { Footer } from "@/components/navigation";
import { Inter } from "next/font/google";
import type { NextPage } from "next";

const inter = Inter({ subsets: ["latin"] });

type options = {
  footer: boolean;
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & options;

const Layout: React.FC<{
  children: React.ReactNode;
  options: options;
}> = ({ children, options: { footer } }) => {
  return (
    <div className={inter.className}>
      <meta
        name="theme-color"
        content={
          "#000000, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        }
        style={{ backgroundColor: "#000000" }}
      />
      <div className="bg-black h-screen relative">
        {/* {navbar && (
          <div className="fixed top-0 left-0 right-0">
            <Navbar />
          </div>
        )} */}

        <div className="px-2 md:px-12 lg:px-40">{children}</div>

        {footer && (
          <div className="fixed bottom-0 left-0 right-0">
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
};

export { Layout };
