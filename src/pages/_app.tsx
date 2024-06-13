import "@/styles/globals.css";

import type { NextPageWithLayout } from "@/components/layout";
import { Layout } from "@/components/layout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextPageWithLayout }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Layout options={{ footer: Component.footer }}>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}
