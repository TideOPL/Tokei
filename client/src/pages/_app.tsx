import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import store from "~/store/store";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="dark">
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
