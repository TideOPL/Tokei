import { useEffect, useState } from "react"
import {Channel} from "../../interface/Channel";
import axios from "axios";
import { env } from "~/env.mjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IconProp } from "./message";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { UserRound } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import useChannel from "~/hook/useChannel";
import useFollow from "~/hook/useFollow";



interface Props {
  username: string
  color: string
  icons: IconProp[]
}

const UserPopUp = ({username, color, icons}: Props) => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const { follow, following, followers} = useFollow(getToken, username)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get<Channel>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/getChannel?channel=${username}`);
      setChannel(data);
    }



    fetch();
  }, [])


  return (
    <div className="flex flex-col px-4 py-4 justify-between h-full">
      <div className="flex flex-row">
        <div className="pr-4">
          <Avatar className="min-w-[64px] min-h-[64px]"> 
          
            <AvatarImage src={channel?.pfp} alt="profile" className="object-cover"/> 
            <AvatarFallback> 
            {
              username.at(0)?.toUpperCase()
            }
            
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="text-lg" style={{color}}>
            {username} 
          </div>
          <div>
            <div className="text-sm text-zinc-400">
              Followers
            </div>
            <div>
              {followers}
            </div>
          </div>
        </div>
      </div>
      {icons.length >= 1 &&
        <div className="flex flex-row space-x-1 pt-4">
          Badges&nbsp;
          {icons.map((icon) => (
            <div style={icon.style} className="pl-0.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {icon.icon}
                  </TooltipTrigger>
                  <TooltipContent>
                    {icon.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      }
      {isSignedIn &&  user.username != channel?.username ?
        <div className="pt-4">
          {following ? 
            <Button className="dark:bg-primary hover:dark:bg-primary_lighter dark:text-white font-semibold min-w-fit px-3" onClick={() => follow(() => getToken())}> <UserRound className="h-4 w-4 self-center"/></Button>
            :
            <Button className="dark:bg-primary hover:dark:bg-primary_lighter dark:text-white text-xs font-semibold" onClick={() => follow(() => getToken())}> <UserRound className="mr-1 h-4 w-4 self-center"/> Follow</Button>
          }
        </div>
        : <></>
      }
    </div>
  )
}

export default UserPopUp