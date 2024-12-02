import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <ClerkProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
