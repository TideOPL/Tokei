import { useAuth, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Nav from "~/component/nav/Nav";
import Browse from "../component/browse/Browse";
import Head from "next/head";
import Sidebar from "~/component/nav/Sidebar";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [title, setTitle] = useState("Tokei | Stream, Chat, and Vibe");

  useEffect(() => {
    setTitle("Tokei | Browse");
  }, []);

  return (
    <div className="max-h-screen-ios dark:bg-back-tertiary flex h-screen max-h-screen flex-col overflow-hidden scroll-smooth bg-light-primary-light">
      <Head>
        <title>{title}</title>
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
        <meta name="theme-color" content="#d926a9" />

        <meta
          name="description"
          content="Tokei 時計: Redefining live streaming with cutting-edge tech. Join our vibrant community of creators shaping the future of real-time content delivery."
        />

        <meta property="og:url" content="https://tokei.live" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content="Tokei 時計: Redefining live streaming with cutting-edge tech. Join our vibrant community of creators shaping the future of real-time content delivery."
        />

        <meta
          content="https://tokei.live/android-chrome-192x192.png"
          property="og:image"
        />

        <link
          type="application/json+oembed"
          href="https://tokei.live/oembed.json"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="tokei.live" />
        <meta property="twitter:url" content="https://tokei.live" />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:description"
          content="Tokei 時計: Redefining live streaming with cutting-edge tech. Join our vibrant community of creators shaping the future of real-time content delivery."
        />
      </Head>
      {/**@ts-ignore**/}
      <Nav user={user} signOut={() => signOut()} />

      <div className="flex max-h-[calc(100%-64px)] flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex h-full max-h-full flex-grow flex-col ">
          <Browse />
        </div>
      </div>
    </div>
  );
}
