"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Nav from "~/component/nav/Nav";
import dynamic from "next/dynamic";
import { Channel } from "~/interface/Channel";
import axios from "axios";
import { env } from "~/env.mjs";
import useChannel from "~/hook/useChannel";
import Clock from "~/component/ui/clock";
import { Avatar, AvatarFallback, AvatarImage } from "../component/ui/avatar";
import { Badge } from "~/component/ui/badge";
import { getRelativeTime } from "~/lib/utils";
import Sidebar from "~/component/nav/Sidebar";
import Chat from "~/component/chat/chat";
import Viewers from "~/component/ui/viewers";
import { Button } from "~/component/ui/button";
import {
  Github,
  Instagram,
  LucideInstagram,
  Star,
  Twitter,
  UserRound,
  X,
  Youtube,
} from "lucide-react";
import {
  DiscordLogoIcon,
  InstagramLogoIcon,
  StarFilledIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import About from "~/component/channel/about";
import ChannelLink from "~/component/channel/channel-links";
import PlayerControls from "~/component/video/player-controls";
import TokeiPlayer from "~/component/video/tokei-player";
import { useAppDispatch } from "~/store/hooks";
import { IEmote } from "~/interface/chat";
import { addEmote } from "~/store/slice/emoteSlice";
import { addChannel } from "~/store/slice/userSlice";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export const getServerSideProps = (async (context) => {
  if (
    context.params?.channel == undefined ||
    context.params?.channel[0] == undefined
  ) {
    return {
      notFound: true,
    };
  }

  axios.defaults.url = `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}`;
  const channel_name = context.params.channel;

  const channelData = (await axios
    .get(
      `http://${env.NEXT_PUBLIC_URL}:${
        env.NEXT_PUBLIC_EXPRESS_PORT
      }/api/v1/user/getChannel?channel=${channel_name.concat()}`
    )
    .then((res) => res.data)
    .catch()) as Channel | null | undefined;

  if (!channelData) {
    return {
      notFound: true,
    };
  }

  return { props: { channelData } };
}) satisfies GetServerSideProps<{ channelData: Channel }>;

const Channel = ({
  channelData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, getToken } = useAuth();
  const [hasWindow, setHasWindow] = useState(true);

  const { channel, stream, follow, following, followers } = useChannel(
    getToken,
    channelData,
    //@ts-ignore
    user
  );
  const [viewers, setViewers] = useState(1);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get<IEmote[]>(
        `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/chat/getEmotes`,
      );

      data.map((emote) => dispatch(addEmote(emote)));
    };

    fetch();
    dispatch(addChannel(channel));
  }, []);

  return (
    <div className="max-h-screen-ios flex h-screen max-h-screen flex-col overflow-y-hidden scroll-smooth bg-light-primary-light dark:bg-[#141516]">
      <Head>
        <title>{"Tokei - " + channel.username}</title>
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
      </Head>

      {/*@ts-ignore -- Bug with Clerk types.*/}
      <Nav user={user} signOut={() => signOut()} />

      <div className="flex max-h-[calc(100%-64px)] flex-1">
        <Sidebar />
        <div className="flex h-full max-h-full flex-grow overflow-y-scroll">
          {channel.isLive && (
            <div className="h-full max-h-[60%] w-full max-w-[71.2vw]">
              <TokeiPlayer channel={channel.username} />
              <div className="flex flex-col justify-center">
                <div className="flex flex-row space-x-3 px-5 py-2">
                  <div className="relative h-fit w-fit self-center rounded-full border-2 border-primary">
                    <div className="md:text-md absolute left-[8px] top-10 z-10 justify-self-end rounded-lg bg-primary px-1 text-sm  font-bold text-white md:left-3.5 md:top-12 md:font-semibold">
                      LIVE
                    </div>
                    <Avatar className="min-h-[52px] min-w-[52px] md:min-h-[64px] md:min-w-[64px]">
                      <AvatarImage
                        src={channel.pfp}
                        alt="profile"
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {channel.username.at(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex w-full flex-row justify-between">
                    <div className="flex flex-col">
                      <button className="channel flex flex-row space-x-2 font-semibold transition-all dark:text-white">
                        <div className="self-center text-xl font-bold">
                          {channel.username}
                        </div>
                      </button>
                      <div className="title font-semibold dark:text-white">
                        {stream?.streamTitle}
                      </div>
                      <div className="flex flex-row">
                        <div className="category font-semibold text-primary_lighter dark:text-primary">
                          {stream?.category}
                        </div>
                        <div className="space-x-2 pl-2">
                          {stream?.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="w-fit rounded-xl"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-row items-center justify-end gap-x-2">
                        <Viewers viewers={viewers} />
                        <Clock timestamp={stream?.timestamp || "0"} />
                      </div>
                      {user && user.id != channel.clerk_id ? (
                        <div className="flex flex-row items-center justify-end gap-x-2 py-2">
                          {following ? (
                            <Button
                              className="min-w-fit px-3 font-semibold dark:bg-primary dark:text-white hover:dark:bg-primary_lighter"
                              onClick={() => follow(() => getToken())}
                            >
                              <UserRound className="mt-[1px] h-4 w-4 self-center" />
                            </Button>
                          ) : (
                            <Button
                              className="min-w-[93.92px] font-semibold dark:bg-primary dark:text-white hover:dark:bg-primary_lighter"
                              onClick={() => follow(() => getToken())}
                            >
                              <UserRound className="mr-1 mt-[1px] h-4 w-4 self-center" />{" "}
                              Follow
                            </Button>
                          )}
                          <Button className="min-w-[93.92px] font-semibold dark:bg-blue-500 dark:text-white hover:dark:bg-primary_lighter">
                            <StarFilledIcon className="mr-1 mt-[1px] h-4 w-4 self-center" />{" "}
                            {following ? "Subscribe" : "Subscribe"}
                          </Button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <About channel={channel} followers={followers} />
              <ChannelLink />
            </div>
          )}
          {!channel.isLive && (
            <div className="flex h-[60vh] min-h-fit w-full max-w-[100%] flex-col">
              <div className="mb-4 flex h-full min-h-[52rem] w-full flex-col justify-center bg-[#212224]/75 dark:bg-zinc-800/50">
                <div className="pb-2 text-center text-4xl font-extrabold text-white md:text-8xl">
                  {channel.username}
                </div>
                <div className="text-center text-2xl font-bold text-white md:text-4xl">
                  Is currently offline
                </div>
                <div className="text-center text-2xl font-semibold text-white md:text-xl">
                  they were last live{" "}
                  {getRelativeTime(parseInt(stream?.timestamp || "0"))}
                </div>
              </div>
              <div className="flex flex-row space-x-3 px-5 py-2">
                <div className="relative h-fit w-fit self-center rounded-full border-2 border-none">
                  <Avatar className="min-h-[52px] min-w-[52px] md:min-h-[64px] md:min-w-[64px]">
                    <AvatarImage
                      src={channel.pfp}
                      alt="profile"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {channel.username.at(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex w-full flex-row justify-between">
                  <div className="flex flex-col">
                    <button className="channel flex flex-row space-x-2 font-semibold transition-all dark:text-white">
                      <div className="self-center text-xl font-bold">
                        {channel.username}
                      </div>
                    </button>
                    <div className="title font-semibold dark:text-white">
                      {stream?.streamTitle}
                    </div>
                    <div className="flex flex-row">
                      <div className="category font-semibold text-primary_lighter dark:text-primary">
                        {stream?.category}
                      </div>
                      <div className="space-x-2 pl-2">
                        {stream?.tags.map((tag) => (
                          <Badge
                            variant="secondary"
                            className="w-fit rounded-xl"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <About channel={channel} followers={followers} />
              <ChannelLink />
            </div>
          )}
        </div>
        <Chat
          setViewers={setViewers}
          channel={channel}
          getToken={() => getToken()}
        />
      </div>
    </div>
  );
};

export default Channel;
