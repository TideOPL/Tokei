import { useUser } from "@clerk/nextjs"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import Nav from "~/component/nav/Nav"
import dynamic from 'next/dynamic'
import { User } from "~/interface/User"
import axios from "axios"
import { env } from "~/env.mjs"
import { log } from "console"


const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });


export const getServerSideProps = (async (context) => {

  
  if (context.params?.channel == undefined || context.params?.channel[0] == undefined) {
    return {
      notFound: true,
    }
  }

  axios.defaults.url = `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}`;
  const channel_name = context.params.channel
  
  const channel = await axios.get(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/getChannel?channel=${channel_name.concat()}`).then(res => res.data).catch(err => console.log(err)) as User | null | undefined
  console.log(channel)


  if (!channel) {
    return {
      notFound: true,
    }
  }

   return { props: { channel } }
}) satisfies GetServerSideProps<{ channel: User}>

const Channel = ({ channel }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    <div className="w-full sm:min-h-screen min-h-screen-ios bg-light-primary-light dark:bg-dark-primary-dark scroll-smooth">
    <Head>
      <title>{"Tokei -" + channel.username}</title>
      <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
    </Head>
    <div className="sticky top-0 z-[1000] h-24">
      {/*@ts-ignore -- Bug with Clerk types.*/}
      <Nav user={user}/>
    </div>
    <div className="flex justify-center">
      {channel.isLive && 
        <div className="flex flex-col h-4/5 w-4/5 max-w-6xl">
            {hasWindow && 
              <div>
                  <ReactPlayer 
                    url={`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/live.flv?channel=${channel.username}`}
                    playing={true}
                    style={{ flex: 1, width: '100%', height: '100%'}}
                    height={"100%"}
                    width={"100%"}
                    controls
                  />
              </div>
            }
            <div className="">
              <div className="title dark:text-white font-bold text-2xl">{"TITLE TO ADD"}</div>
              <button className="channel dark:text-white font-semibold hover:text-primary transition-all">
                {channel.username}
              </button>
            </div>
        </div>
      }
    </div>
  </div>
  )
}

export default Channel