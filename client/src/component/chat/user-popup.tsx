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
import { ShieldMinus, UserRound } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import useFollow from "~/hook/useFollow";
import { Separator } from "../ui/separator";
import { GoAlert, GoShieldCheck } from "react-icons/go";
import {
  IoAlert,
  IoBan,
  IoBanOutline,
  IoMicOffCircleOutline,
  IoMicOffOutline,
  IoMicOutline,
  IoPersonAddOutline,
  IoPersonRemoveOutline,
  IoTimeOutline,
  IoWarningOutline,
  IoWatchOutline,
} from "react-icons/io5";
import { formatDate } from "~/lib/utils";
import usePopout from "~/hook/usePopout";
import useModerate from "~/hook/useModerate";
import { useEffect } from "react";
import Link from "next/link";
import { FaBan, FaRegClock } from "react-icons/fa6";

interface Props {
  username: string;
  color: string;
  icons: IconProp[];
  chatRoom: Channel;
}

const UserPopUp = ({ username, color, icons, chatRoom }: Props) => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { channel, isMod, setIsMod } = usePopout(getToken, username);
  const { amIMod } = useModerate(getToken, chatRoom);
  const { follow, following, followers, chatRoomFollowSince } = useFollow(
    getToken,
    username,
    chatRoom.username,
  );
  const date = new Date(parseInt(chatRoomFollowSince.trim()));

  useEffect(() => {
    console.log(amIMod);
  }, [amIMod]);
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
          <Link href={`/${username}`} className="text-lg" style={{ color }}>
            {username}
          </Link>
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
                  <div className="text-center">{formatDate(date)}</div>
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
      {user?.username != username && (
        <div className="relative min-h-[1.5rem]">
          <div className="flex flex-row justify-between">
            <TooltipProvider>
              {amIMod && chatRoom.username != username && (
                <div className="space-x-1.5">
                  <Tooltip>
                    <TooltipTrigger
                      onClick={async () => {
                        const token = await getToken();
                        await axios.get(
                          `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/moderation/addMod?channel=${username}`,
                          { headers: { Authorization: `Bearer ${token}` } },
                        );
                        setIsMod((state) => !state);
                      }}
                    >
                      {isMod ? (
                        <IoPersonRemoveOutline className="mr-1 h-[23px] w-[24px] self-center pb-0.5 transition-all hover:text-red-500" />
                      ) : (
                        <IoPersonAddOutline className="mr-1 h-[23px] w-[24px] self-center pb-0.5 transition-all hover:text-primary" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {isMod ? "Remove Moderator" : "Add Moderator"}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => console.log("Ban ", { username })}
                    >
                      <IoTimeOutline className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent
                      style={{
                        color: "#FF6347",
                      }}
                    >
                      Timeout {username}
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
                </div>
              )}
              <div className="flex w-full justify-end">
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => console.log("Report ", { username })}
                  >
                    <IoMicOutline className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-red-500" />
                  </TooltipTrigger>
                  <TooltipContent
                    style={{
                      color: "#FF6347",
                    }}
                  >
                    Mute {username}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => console.log("Report ", { username })}
                  >
                    <IoWarningOutline className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-red-500" />
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
        </div>
      )}
    </div>
  );
};

export default UserPopUp;
