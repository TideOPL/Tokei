import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import axios from "axios";
import { env } from "~/env.mjs";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  )
};

export default MyApp;
