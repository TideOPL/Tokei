import { useAuth, useUser } from "@clerk/nextjs";
import React from "react";
import Nav from "~/component/nav/Nav";
import Browse from "../component/browse/Browse";
import Head from "next/head";
import Categories from "../component/browse/Browse";
import Sidebar from "~/component/nav/Sidebar";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) {
    // Loading Screen?
    return <div />;
  }

  return (
    <div className="max-h-screen-ios flex h-screen max-h-screen flex-col overflow-hidden scroll-smooth bg-light-primary-light dark:bg-[#141516]">
      <Head>
        <title>Tokei - Browse</title>
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
      </Head>
      {/**@ts-ignore**/}
      <Nav user={user} signOut={() => signOut()} />

      <div className="flex max-h-[calc(100%-64px)] flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex h-full max-h-full flex-grow ">
          <Browse />
        </div>
      </div>
    </div>
  );
}
