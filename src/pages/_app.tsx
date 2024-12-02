import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    
    <div className={GeistSans.className}>
      <ClerkProvider>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="some content" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Toaster position="top-right" reverseOrder={false} />
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
