import { type AppType } from "next/dist/shared/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "react-redux";
import store from "~/store/store";
import "~/styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div>
      <Head>
        <title>Tokei - Browse</title>
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
        <meta name="theme-color" content="#d926a9" />

        <meta
          name="description"
          content="Discover Tokei 時計, a groundbreaking open-source initiative revolutionizing live streaming. Dive into a community of innovators, developers, and creators shaping the future of real-time content delivery. Explore cutting-edge technology and unleash your creativity with Tokei 時計."
        />

        <meta property="og:url" content="https://tokei.live" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Categories - Tokei" />
        <meta
          property="og:description"
          content="Discover Tokei 時計, a groundbreaking open-source initiative revolutionizing live streaming. Dive into a community of innovators, developers, and creators shaping the future of real-time content delivery. Explore cutting-edge technology and unleash your creativity with Tokei 時計."
        />
        <meta
          property="og:image"
          content="https://www.tokei.live/android-chrome-512x512.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="tokei.live" />
        <meta property="twitter:url" content="https://tokei.live" />
        <meta name="twitter:title" content="Categories - Tokei" />
        <meta
          name="twitter:description"
          content="Discover Tokei 時計, a groundbreaking open-source initiative revolutionizing live streaming. Dive into a community of innovators, developers, and creators shaping the future of real-time content delivery. Explore cutting-edge technology and unleash your creativity with Tokei 時計."
        />
        <meta
          name="twitter:image"
          content="https://www.tokei.live/android-chrome-512x512.png"
        />
      </Head>
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
