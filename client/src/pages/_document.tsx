import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
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
        <meta
          name="theme-color"
          content="#d926a9"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#d926a9"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
