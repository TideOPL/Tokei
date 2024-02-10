import { useAuth, useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import Nav from "~/component/nav/Nav";
import Browse from "../component/browse/Browse";
import Head from "next/head";
import Sidebar from "~/component/nav/Sidebar";
import { addFollowingChannel } from "~/store/slice/followSlice";
import axios from "axios";
import { Channel, ILiveFollowing, Stream } from "~/interface/Channel";
import { env } from "~/env.mjs";
import { useAppDispatch } from "~/store/hooks";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, getToken } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getFollowingList = async () => {
      const token = await getToken();
      const { data } = await axios.get<Channel[]>(
        `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/getFollowingList`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const liveFollowing: ILiveFollowing[] = [];

      for (let j = 0; j < data.length; j++) {
        const channel = data[j];

        if (!channel) {
          continue;
        }

        if (channel.isLive) {
          const { data } = await axios.get<Stream>(
            `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getStream?channelID=${channel.clerk_id}`,
          );
          liveFollowing.push({
            following: channel,
            stream: data,
          });
          continue;
        }

        liveFollowing.push({
          following: channel,
        });
      }

      liveFollowing.map((following) =>
        dispatch(addFollowingChannel(following)),
      );
    };

    if (isSignedIn) {
      getFollowingList();
    }
  }, [isSignedIn]);

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
