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
import Footer from "~/component/nav/Footer";

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

  // if (!isLoaded) {
  //   // Loading Screen?
  //   return <div />;
  // }

  return (
    <div className="max-h-screen-ios flex h-screen max-h-screen flex-col overflow-hidden scroll-smooth bg-light-primary-light dark:bg-[#141516]">
      <Head>
        <title>Tokei - Browse</title>
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
        <meta property="og:title" content="Categories - Tokei" />
        <meta
          property="og:description"
          content="Tokei 時計: Redefining live streaming with cutting-edge tech. Join our vibrant community of creators shaping the future of real-time content delivery."
        />
        <meta
          property="og:image:secure_url"
          content="https://tokei.live/android-chrome-512x512.png"
        />
        <meta property="og:image:type" content="image/png"></meta>
        <meta property="og:image:width" content="250" />
        <meta property="og:image:height" content="250" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="tokei.live" />
        <meta property="twitter:url" content="https://tokei.live" />
        <meta name="twitter:title" content="Categories - Tokei" />
        <meta
          name="twitter:description"
          content="Tokei 時計: Redefining live streaming with cutting-edge tech. Join our vibrant community of creators shaping the future of real-time content delivery."
        />
        <meta
          name="twitter:image"
          content="https://tokei.live/android-chrome-512x512.png"
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
