import { useUser } from "@clerk/nextjs";
import React from "react";
import Nav from "~/component/nav/Nav";
import Browse from "./home/Browse";
import Head from "next/head";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  if (!isLoaded) {
    // Loading Screen?
    return <div />
  }

  return (
        <body className="w-full sm:min-h-screen min-h-screen-ios bg-light-primary-light dark:bg-dark-primary-dark scroll-smooth">
          <Head>
            <title>Tokei - Browse</title>
            <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
          </Head>
          <div className="sticky top-0 z-[1000] h-24">
            {/**@ts-ignore**/}
            <Nav user={user}/>
          </div>
          <Browse />
        </body>
  );
}
