import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import store from "~/store/store";
import "~/styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div>
      <ClerkProvider {...pageProps}>
        <Provider store={store}>
          <div className="dark">
            <Component {...pageProps} />
          </div>
        </Provider>
      </ClerkProvider>
    </div>
  );
};

export default MyApp;
