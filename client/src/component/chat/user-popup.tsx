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
import { UserRound } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import useFollow from "~/hook/useFollow";
import { Separator } from "../ui/separator";
import {
  IoBan,
  IoBanOutline,
  IoCheckmarkDone,
  IoCheckmarkDoneOutline,
  IoCheckmarkOutline,
  IoMicOutline,
  IoPersonAddOutline,
  IoPersonRemoveOutline,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { formatDate } from "~/lib/utils";
import usePopout from "~/hook/usePopout";
import useModerate from "~/hook/useModerate";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "../ui/input";

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
  const {
    amIMod,
    timeoutUser,
    unTimeoutUser,
    chatBanUser,
    unChatBanUser,
    checkChatStatus,
  } = useModerate(getToken, chatRoom);
  const { follow, following, followers, chatRoomFollowSince } = useFollow(
    getToken,
    username,
    chatRoom.username,
  );
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [initBan, setInitBan] = useState(false);
  const [banReason, setBanReason] = useState("");
  const date = new Date(parseInt(chatRoomFollowSince.trim()));

  useEffect(() => {
    const fetch = async () => {
      const data = await checkChatStatus(channel?.clerk_id || "");

      if (!data) {
        return;
      }
      if (data.type == "timeout") {
        setIsTimedOut(true);
      }
      if (data.type == "ban") {
        setIsBanned(true);
      }
    };

    fetch();
  }, [channel]);
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
            {chatRoomFollowSince.length > 1 ? (
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
            ) : (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-4 dark:bg-zinc-600"
                />
                <div>
                  <div className="text-center text-sm text-zinc-400">
                    Created On
                  </div>
                  <div className="text-center">
                    {formatDate(new Date(channel?.createdOn || 0))}
                  </div>
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
      {isSignedIn && user.username != channel?.username && (
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
      )}
      {user?.username != username && channel && (
        <>
          <Separator className="my-4 dark:bg-zinc-600" />
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
                        // 10 minute time out
                        onClick={async () => {
                          if (isTimedOut) {
                            await unTimeoutUser(channel.clerk_id).then(() => {
                              setIsTimedOut(false);
                              toast(
                                `Successfully untimed-out ${channel.username}`,
                                {
                                  description: "They have been unmuted.",
                                },
                              );
                            });
                            return;
                          }
                          await timeoutUser(
                            channel.clerk_id,
                            chatRoom.clerk_id,
                            new Date(+new Date() + 60000 * 10)
                              .valueOf()
                              .toString(),
                            "Unkown Reason",
                          ).then(() => {
                            setIsTimedOut(true);
                            toast(
                              `Successfully timed-out ${channel.username}`,
                              {
                                description:
                                  "They have been muted for 10 minutes.",
                              },
                            );
                          });
                        }}
                      >
                        {isTimedOut ? (
                          <IoCheckmarkOutline className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-red-500" />
                        ) : (
                          <IoTimeOutline className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-red-500" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent
                        style={{
                          color: "#FF6347",
                        }}
                      >
                        {isTimedOut && "Un-"}Timeout {username}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={async () => {
                          if (isBanned) {
                            await unChatBanUser(channel.clerk_id).then(() => {
                              setIsBanned(false);
                              toast(
                                `Successfully Unbanned ${channel.username}`,
                                {
                                  description: "They have been unBanned.",
                                },
                              );
                            });
                            return;
                          }
                          setInitBan((prev) => !prev);
                        }}
                      >
                        {isBanned ? (
                          <IoCheckmarkDoneOutline className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-red-500" />
                        ) : (
                          <IoBanOutline className="mr-1 h-[24px] w-[24px] self-center transition-all hover:text-red-500" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {isBanned ? `Unban ${username}` : `Ban ${username}`}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
                <div
                  className={`flex ${!amIMod && "w-full"} ${chatRoom.username == username && "w-full"} justify-end`}
                >
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
            <div
              className={`overflow-hidden transition-all ${initBan ? "h-16" : "h-0 overflow-hidden"} relative right-0 w-full duration-300 delay-150`}
            >
              <Input
                placeholder="Type a reason..."
                className={`z-50 m-[1px] mt-2 h-12 w-[95%] select-text break-all rounded-none border-none pr-10 focus:border-none focus:bg-none dark:bg-[#eaeaea]/5`}
                value={banReason}
                onChange={(evt) => setBanReason(evt.currentTarget.value)}
              />
              <Button
                variant={"link"}
                className="absolute right-5 top-[19px] m-0 h-fit p-0"
                onClick={async () => {
                  await chatBanUser(
                    channel.clerk_id,
                    chatRoom.clerk_id,
                    banReason,
                  ).then(() => {
                    setInitBan((prev) => !prev);
                    setBanReason("");
                    setIsBanned(true);
                    toast(`Successfully banned ${channel.username}`, {
                      description: "They have been permanantly banned.",
                    });
                  });
                }}
              >
                <IoCheckmarkOutline className="mr-1 h-[22px] w-[22px] self-center transition-all hover:text-lime-400" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPopUp;
