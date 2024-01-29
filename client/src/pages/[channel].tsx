"use client";

import { useAuth, useUser } from "@clerk/nextjs"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import Nav from "~/component/nav/Nav"
import dynamic from 'next/dynamic'
import { Channel } from "~/interface/Channel"
import axios from "axios"
import { env } from "~/env.mjs"
import useChannel from "~/hook/useChannel"
import Clock from "~/component/ui/clock";
import { Avatar, AvatarFallback, AvatarImage } from "../component/ui/avatar";
import { Badge } from "~/component/ui/badge";
import { getRelativeTime } from "~/lib/utils";
import Sidebar from "~/component/nav/Sidebar";
import Chat from "~/component/chat/chat";
import Viewers from "~/component/ui/viewers";
import { Button } from "~/component/ui/button";
import { Star, UserRound } from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";


const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });


export const getServerSideProps = (async (context) => {

  
  if (context.params?.channel == undefined || context.params?.channel[0] == undefined) {
    return {
      notFound: true,
    }
  }

  axios.defaults.url = `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}`;
  const channel_name = context.params.channel
  
  const channelData = await axios.get(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/getChannel?channel=${channel_name.concat()}`).then(res => res.data).catch() as Channel | null | undefined

  if (!channelData) {
    return {
      notFound: true,
    }
  }

   return { props: { channelData } }
}) satisfies GetServerSideProps<{ channelData: Channel}>

const Channel = ({ channelData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, getToken } = useAuth();
  const [hasWindow, setHasWindow] = useState(true);
  //@ts-ignore
  const {channel, stream, follow, following} = useChannel(getToken, channelData, user)
  const [viewers, setViewers] = useState(1);

  return (

      <div className="flex flex-col max-h-screen-ios h-screen max-h-screen bg-light-primary-light dark:bg-[#141516] scroll-smooth overflow-y-hidden">
        <Head>
          <title>{"Tokei - " + channel.username}</title>
          <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
        </Head>

        {/*@ts-ignore -- Bug with Clerk types.*/}
        <Nav user={user} signOut={() => signOut()}/>
        

        <div className="flex flex-1 max-h-[calc(100%-64px)]">
          <Sidebar />
          <div className="flex flex-grow h-full max-h-full overflow-y-scroll">
            {channel.isLive && 
              <div className="h-full w-full max-h-[60%] max-w-[71.2vw]">
                  {hasWindow && 
                    <div className="relative pt-[56.25%]">
                        <ReactPlayer
                          url={`http://${env.NEXT_PUBLIC_URL}:8001/api/v1/${channel.username}/index.m3u8`}
                          style={{position: "absolute", top: 0, left: 0}}
                          playing={true}
                          muted={true}
                          height={"100%"}
                          width={"100%"}
                          controls={true}
                        />
                      </div>
                  }
                <div className="flex flex-row space-x-3 py-2 px-5">
                  <div className="relative h-fit w-fit self-center border-primary border-2 rounded-full">
                    <div className="font-bold md:font-semibold text-white text-sm md:text-md top-10 left-[8px] md:top-12 md:left-3.5 absolute  z-10 justify-self-end bg-primary rounded-lg px-1">
                        LIVE
                    </div>
                    <Avatar className="min-w-[52px] min-h-[52px] md:min-w-[64px] md:min-h-[64px]">
                          <AvatarImage src={channel.pfp} alt="profile" className="object-cover"/>
                          <AvatarFallback>{channel.username.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-col">
                    <button className="channel dark:text-white font-semibold transition-all flex flex-row space-x-2">  
                        <div className="self-center text-xl font-bold">
                          {channel.username}
                        </div>
                      </button>
                      <div className="title dark:text-white font-semibold">{stream?.streamTitle}</div>
                      <div className="flex flex-row">
                        <div className="category text-primary_lighter dark:text-primary font-semibold">{stream?.category}</div>
                        <div className="pl-2 space-x-2">
                          {stream?.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="w-fit rounded-xl">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-row gap-x-2 justify-end items-center">
                        <Viewers viewers={viewers} />
                        <Clock timestamp={stream?.timestamp || '0'} />
                      </div>
                      { user && user.id != channel.clerk_id ?
                        <div className="flex flex-row gap-x-2 justify-end items-center py-2">
                          {following ? 
                            <Button className="dark:bg-primary hover:dark:bg-primary_lighter dark:text-white font-semibold min-w-fit px-3" onClick={() => follow(() => getToken())}> <UserRound className="h-4 w-4 mt-[1px] self-center"/></Button>
                            :
                            <Button className="dark:bg-primary hover:dark:bg-primary_lighter dark:text-white font-semibold min-w-[93.92px]" onClick={() => follow(() => getToken())}> <UserRound className="mr-1 h-4 w-4 mt-[1px] self-center"/> Follow</Button>
                          }
                          <Button className="dark:bg-blue-500 hover:dark:bg-primary_lighter dark:text-white font-semibold min-w-[93.92px]"> <StarFilledIcon className="mr-1 h-4 w-4 mt-[1px] self-center"/> {following ? "Subscribe" : "Subscribe"}</Button>
                        </div>
                        : 
                        <></>
                      }
                    </div>
                  </div>
                </div>
              </div>

            }
            {!channel.isLive &&
              <div className="flex flex-col h-[60vh] w-full min-h-fit max-w-[100%]">
                <div className="flex flex-col h-full w-full justify-center bg-[#212224]/75 dark:bg-zinc-800/50 mb-4 min-h-[52rem]">
                  <div className="text-center font-extrabold text-4xl md:text-8xl text-white">
                    {channel.username}
                  </div>
                  <div className="text-center font-bold text-2xl md:text-4xl text-white">
                    Is currently offline
                  </div>
                  <div className="text-center font-semibold text-2xl md:text-xl text-white">
                    they were last live {getRelativeTime(parseInt(stream?.timestamp || '0'))}
                  </div>
                </div>
                <div className="flex flex-row space-x-3 py-2 px-5">
                  <div className="relative h-fit w-fit self-center border-none border-2 rounded-full">
                    <Avatar className="min-w-[52px] min-h-[52px] md:min-w-[64px] md:min-h-[64px]">
                          <AvatarImage src={channel.pfp} alt="profile" className="object-cover"/>
                          <AvatarFallback>{channel.username.at(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-col">
                    <button className="channel dark:text-white font-semibold transition-all flex flex-row space-x-2">  
                        <div className="self-center text-xl font-bold">
                          {channel.username}
                        </div>
                      </button>
                      <div className="title dark:text-white font-semibold">{stream?.streamTitle}</div>
                      <div className="flex flex-row">
                        <div className="category text-primary_lighter dark:text-primary font-semibold">{stream?.category}</div>
                        <div className="pl-2 space-x-2">
                          {stream?.tags.map((tag) => (
                              <Badge variant="secondary" className="w-fit rounded-xl">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } 
        </div>
        <Chat setViewers={setViewers} channel={channel} getToken={() => getToken()} />
      </div>
    </div>
  )
}

export default Channel