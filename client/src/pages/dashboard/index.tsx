"use client";
import { useUser, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import React, { ReactElement } from "react";
import Nav from "~/component/nav/Nav";

const Dashboard = (): ReactElement => {
  const { isLoaded, isSignedIn, user } = useUser();
  const {signOut} = useAuth();

  if (!isLoaded) {
    // Loading Screen?
    return <div />
  }

  return (
    <body className="w-full sm:min-h-screen min-h-screen-ios bg-light-primary-light dark:bg-[#212224] scroll-smooth">
      <Head>
        <title>Tokei - Dashboard</title>
        <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
      </Head>
      <div className="sticky top-0 z-[1] h-24">
        {/**@ts-ignore**/}
        <Nav user={user} signOut={() => signOut()}/>
      </div>
    </body>
  )
}

export default Dashboard