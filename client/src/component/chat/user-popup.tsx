import { useEffect, useState } from "react";
import { Channel } from "../../interface/Channel";
import axios from "axios";
import { env } from "~/env.mjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IconProp } from "./message";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  FlagIcon,
  HammerIcon,
  ShieldCheck,
  ShieldMinus,
  ShieldPlus,
  SwordIcon,
  UserRound,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import useFollow from "~/hook/useFollow";
import { Separator } from "../ui/separator";
import { GoAlert, GoShieldCheck } from "react-icons/go";
import { IoBanOutline } from "react-icons/io5";
import { date } from "zod";
import { useAppSelector } from "~/store/hooks";

interface Props {
  username: string;
  color: string;
  icons: IconProp[];
  chatRoom: Channel;
}

const UserPopUp = ({ username, color, icons, chatRoom }: Props) => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const { follow, following, followers, chatRoomFollowSince } = useFollow(
    getToken,
    username,
    chatRoom.username,
  );
  const channels = useAppSelector((state) => state.channels);

  const date = new Date(parseInt(chatRoomFollowSince.trim()));

  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${day} ${month}  ${year}`;

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get<Channel>(
        `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/getChannel?channel=${username}`,
      );
      setChannel(data);
    };

    const channel: Channel[] = channels.channels.filter(
      (channel) => channel.username === username,
    );

    if (channel[0] != null) {
      setChannel(channel[0]);
      return;
    }

    fetch();
  }, []);

  console.log(chatRoomFollowSince);

  return (
    <div className="flex h-full flex-col justify-between px-4 py-4">
      <div className="flex flex-row">
        <div className="pr-4">
          <Avatar className="min-h-[64px] min-w-[64px]">
            <AvatarImage
              src={channel?.pfp}
              alt="profile"
              className="object-cover"
            />
            <AvatarFallback>{username.at(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="text-lg" style={{ color }}>
            {username}
          </div>
          <div className="flex flex-row">
            <div>
              <div className="text-sm text-zinc-400">Followers</div>
              <div className="text-center">{followers}</div>
            </div>
            {chatRoomFollowSince.length > 1 && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-4 dark:bg-zinc-600"
                />
                <div>
                  <div className="text-sm text-zinc-400">Followed Since</div>
                  <div className="text-center">{formattedDate}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {icons.length >= 1 && (
        <div className="flex flex-row space-x-1 pt-4">
          Badges&nbsp;
          {icons.map((icon) => (
            <div style={icon.style} className="pl-0.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>{icon.icon}</TooltipTrigger>
                  <TooltipContent>{icon.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      )}
      {isSignedIn && user.username != channel?.username ? (
        <div className="pt-4">
          {following ? (
            <Button
              className="min-w-fit px-3 font-semibold dark:bg-primary dark:text-white hover:dark:bg-primary_lighter"
              onClick={() => follow(() => getToken())}
            >
              <UserRound className="h-4 w-4 self-center" />
            </Button>
          ) : (
            <Button
              className="text-xs font-semibold dark:bg-primary dark:text-white hover:dark:bg-primary_lighter"
              onClick={() => follow(() => getToken())}
            >
              <UserRound className="mr-1 h-4 w-4 self-center" /> Follow
            </Button>
          )}
        </div>
      ) : (
        <></>
      )}
      <Separator className="my-4 dark:bg-zinc-600" />
      {user?.username == chatRoom.username && (
        <div>
          {chatRoom.channelMods.includes(channel?.clerk_id || "") ? (
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => () => getToken()}>
                    <ShieldMinus className="mr-1 h-4 w-4 self-center" />
                  </TooltipTrigger>
                  <TooltipContent>Remove Moderator</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => console.log("Mod Added")}>
                    <GoShieldCheck className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent
                    style={{
                      color: "#D966BD",
                    }}
                  >
                    Add Moderator
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => console.log("Ban ", { username })}
                  >
                    <IoBanOutline className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-red-500" />
                  </TooltipTrigger>
                  <TooltipContent
                    style={{
                      color: "#FF6347",
                    }}
                  >
                    Ban {username}
                  </TooltipContent>
                </Tooltip>
                <div className="absolute bottom-0 right-0">
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => console.log("Report ", { username })}
                    >
                      <GoAlert className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent
                      style={{
                        color: "#FF6347",
                      }}
                    >
                      Report {username}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPopUp;
