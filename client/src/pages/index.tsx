import { useAuth, useUser } from "@clerk/nextjs";
import React from "react";
import Nav from "~/component/nav/Nav";
import Browse from "../component/browse/Browse";
import Head from "next/head";
import Categories from "../component/browse/Browse";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) {
    // Loading Screen?
    return <div />;
  }

  return (
    <body className="min-h-screen w-full scroll-smooth bg-light-primary-light min-h-screen-ios dark:bg-[#212224]">
      <Head>
        <title>Tokei - Browse</title>
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
      </Head>
      <div className="sticky top-0 z-[1] h-24">
        {/**@ts-ignore**/}
        <Nav user={user} signOut={() => signOut()} />
      </div>
      <div className="h-full">
        <Browse />
      </div>
    </body>
  );
}
