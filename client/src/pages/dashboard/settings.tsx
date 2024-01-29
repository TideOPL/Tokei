"use client";
import { useUser, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import React, { ReactElement, useEffect, useState } from "react";
import Nav from "~/component/nav/Nav";
import ConfirmDialog from "~/component/settings/ConfirmDialog";
import { Button } from "~/component/ui/button";
import { Input } from "~/component/ui/input";
import { Separator } from "~/component/ui/separator";
import useSettings from "~/hook/useSettings";

const Settings = (): ReactElement => {
  const { isLoaded, isSignedIn, user } = useUser();
  const {signOut, getToken} = useAuth();
  const {showKey, resetKey, copyKey} = useSettings(() => getToken(), user?.id || '');
  const [key, setKey] = useState('abcdefghijklmnopqrstuvwxyz');

  if (!isLoaded) {
    // Loading Screen?
    return <div />
  }

  return (
    <body className="w-full sm:min-h-screen min-h-screen-ios bg-light-primary-light dark:bg-[#212224] scroll-smooth">
      <Head>
        <title>Tokei - Settings</title>
        <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
      </Head>
      <div className="sticky top-0 z-[1] h-24">
        {/**@ts-ignore**/}
        <Nav user={user} signOut={() => signOut()}/>
      </div>

      <div className="container flex justify-center items-center">
        <div className="card bg-[#fefefe] dark:bg-zinc-800 w-3/4 h-full rounded-md shadow-md font-noto-sans dark:text-white p-3">
          <div className="title text-4xl font-semibold">Settings</div>
          <Separator className="my-4 bg-zinc-500 dark:bg-zinc-500" />
          <div className="body w-full h-full">
            <div className="stream">
              <div className="h-fit w-full flex flex-row py-2 px-4 space-x-40 max-w-6xl">
                  <div className="sub-title min-w-fit font-medium text-sm">Stream key</div>
                  <div className="flex flex-col w-full space-x-2">
                    <div className="flex flex-row space-x-2 w-full">
                      <Input type={key != 'abcdefghijklmnopqrstuvwxyz' ? 'text' : 'password'} readOnly placeholder="•••••••••••••••••••••••••••••••••••••••••••" value={key} className="max-w-lg select-text border-zinc-500 dark:border-zinc-500 "/>
                      <ConfirmDialog button={<Button type="submit" className="h-8 self-center">Copy</Button>} title="Are you sure you want to copy?" body="This key is super secret! Make sure you clear your clipboard after using it!" confirm={() => copyKey()}/>
                      <ConfirmDialog button={<Button type="submit" variant={"destructive"} className="h-8 self-center">Reset</Button>} title="Are you sure you want to reset?" body="Tokei cannot undo this action!" confirm={() => {resetKey(); setKey('abcdefghijklmnopqrstuvwxyz')}}/>
                    </div>
                    <div>
                      <Button type="submit" variant={"ghost"} className="text-primary_lighter dark:text-primary hover:underline hover:bg-none p-0 h-fit text-xs font-normal" onClick={async () => {setKey(await showKey())}}>Show</Button>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  )
}

export default Settings