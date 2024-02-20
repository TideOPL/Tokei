"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Nav from "~/component/nav/Nav";
import { Channel } from "~/interface/Channel";
import axios from "axios";
import { env } from "~/env.mjs";
import useChannel from "~/hook/useChannel";
import Clock from "~/component/ui/clock";
import { Avatar, AvatarFallback, AvatarImage } from "../component/ui/avatar";
import { Badge } from "~/component/ui/badge";
import Sidebar from "~/component/nav/Sidebar";
import Chat from "~/component/chat/chat";
import Viewers from "~/component/ui/viewers";
import About from "~/component/channel/about";
import ChannelLink from "~/component/channel/channel-links";
import TokeiPlayer from "~/component/video/tokei-player";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { IEmote } from "~/interface/chat";
import { addEmote } from "~/store/slice/emoteSlice";
import { addChannel } from "~/store/slice/userSlice";
import OfflineChannel from "~/component/channel/offline-channel";
import FollowContainer from "~/component/channel/follow-container";
import EditStream from "~/component/channel/edit-stream";
import Link from "next/link";
import useModerate from "~/hook/useModerate";
import { Toaster } from "~/component/ui/sonner";

export const getServerSideProps = (async (context) => {
  if (
    context.params?.channel == undefined ||
    context.params?.channel[0] == undefined
  ) {
    return {
      notFound: true,
    };
  }

  const channel_name = context.params.channel;

  const channelData = (await axios
    .get(
      `${env.NEXT_PUBLIC_SSR_URL}${
        env.NEXT_PUBLIC_EXPRESS_PORT
      }/api/v1/user/getChannel?channel=${channel_name.concat()}`,
    )
    .then((res) => res.data)
    .catch(() => null)) as Channel | null | undefined;

  const title = (await axios
    .get(
      `${env.NEXT_PUBLIC_SSR_URL}${
        env.NEXT_PUBLIC_EXPRESS_PORT
      }/api/v1/getStreamTitle/${channel_name.concat()}`,
    )
    .then((res) => res.data)
    .catch((err) => err.body)) as string | null;

  if (!channelData || !title) {
    return {
      notFound: true,
    };
  }

  return { props: { channelData, title } };
}) satisfies GetServerSideProps;

const Channel = ({
  channelData,
  title,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, getToken } = useAuth();
  const dispatch = useAppDispatch();
  const { channel, stream, follow, following, followers } = useChannel(
    () => getToken(),
    channelData,
    //@ts-ignore
    user,
  );
  const [viewers, setViewers] = useState("1");
  const [disableControls, setDisableControls] = useState(false);
  const streamInfo = useAppSelector((state) => state.streamInfo);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get<IEmote[]>(
        `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/chat/getEmotes`,
      );

      data.map((emote) => dispatch(addEmote(emote)));
    };

    fetch();
    dispatch(addChannel(channel));
  }, []);

  return (
    <div className="max-h-screen-ios flex h-screen max-h-screen flex-col overflow-hidden scroll-smooth bg-light-primary-light dark:bg-back-tertiary">
      <Head>
        <title>{"Tokei - " + channel.username}</title>
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
        <meta name="theme-color" content="#d926a9" />

        <meta name="description" content={streamInfo?.streamInfo?.title} />

        <meta property="og:url" content="https://tokei.live/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={"Tokei - " + channel.username} />
        <meta property="og:description" content={title} />
        <meta
          property="og:image"
          content={
            "https://api.tokei.live/api/v1/getThumbnail/" + channel.username
          }
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="tokei.live" />
        <meta property="twitter:url" content="https://tokei.live/" />
        <meta name="twitter:title" content={"Tokei - " + channel.username} />
        <meta name="twitter:description" content={title} />
        <meta
          name="twitter:image"
          content={
            "https://api.tokei.live/api/v1/getThumbnail/" + channel.username
          }
        />

        <meta
          property="og:video"
          content="https://api.tokei.live/api/v1/tide/index.m3u8"
        />
        <meta property="og:video:type" content="application/x-mpegURL" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
      </Head>

      {/*@ts-ignore -- Bug with Clerk types.*/}
      <Nav user={user} signOut={() => signOut()} />
      <Toaster />
      <div className="flex max-h-[calc(100%-64px)] flex-1">
        <Sidebar />
        <div className="flex h-full max-h-full flex-grow overflow-x-hidden overflow-y-scroll">
          {channel.isLive && (
            <div className="h-full max-h-[60%] w-full max-w-[78.2vw]">
              <TokeiPlayer
                channel={channel.username}
                disableControls={disableControls}
              />
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
                        width={64}
                        height={64}
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
                        {streamInfo?.streamInfo?.title}
                      </div>
                      <div className=" relative flex flex-row">
                        <Link
                          href={`/category/${streamInfo.streamInfo?.category.searchName}`}
                          className="category font-semibold text-primary_lighter hover:underline dark:text-primary"
                        >
                          {streamInfo?.streamInfo?.category.name}
                        </Link>
                        <div className="space-x-2 pl-2">
                          {streamInfo?.streamInfo?.tags.map((tag) => (
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

                      {user && user.id == channel.clerk_id ? (
                        <div className=" relative bottom-2 left-12">
                          <EditStream
                            setActive={setDisableControls}
                            getToken={() => getToken()}
                          />
                        </div>
                      ) : (
                        <></>
                      )}

                      <div className="flex flex-row">
                        {user && user.id != channel.clerk_id ? (
                          <FollowContainer
                            follow={() => follow(() => getToken())}
                            following={following}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <About channel={channel} followers={followers} />
              <ChannelLink />
            </div>
          )}
          {!channel.isLive && (
            <OfflineChannel
              signedIn={isSignedIn}
              channel={channel}
              stream={stream}
              followers={followers}
              userId={user?.id || ""}
              follow={() => follow}
              getToken={getToken}
              following={following}
            />
          )}
        </div>
        <Chat
          setDisableHotkey={setDisableControls}
          setViewers={setViewers}
          channel={channel}
          getToken={() => getToken()}
        />
      </div>
    </div>
  );
};

export default Channel;
