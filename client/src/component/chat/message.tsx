import {
  BadgeCheckIcon,
  GemIcon,
  Shield,
  SwordIcon,
  VideoIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { CSSProperties } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import UserPopUp from "./user-popup";
import { Channel } from "~/interface/Channel";

interface Message {
  username: string;
  message: string;
  color: string;
  icons: string[];
  chatRoom: Channel;
}

export interface IconProp {
  name: string;
  icon: JSX.Element;
  style: CSSProperties;
}

const IconsList: IconProp[] = [
  {
    name: "Broadcaster",
    icon: (
      <VideoIcon className="h-[24px] w-[24px] rounded-md bg-red-500 stroke-[1.75px] px-0.5" />
    ),
    style: {},
  },
  {
    name: "Moderator",
    icon: (
      <SwordIcon className="z-0 h-[24px] w-[24px] rotate-90 rounded-md bg-[#B07ADF] stroke-[1.75px] px-0.5" />
    ),
    style: {},
  },
  {
    name: "Verified",
    icon: (
      <BadgeCheckIcon className="h-[24px] w-[24px] rounded-md bg-primary stroke-[1.75px] px-0.5" />
    ),
    style: {},
  },
];

const Message = ({ icons, username, message, color, chatRoom }: Message) => {
  const userIcon = IconsList.filter((item) => icons.includes(item.name));

  return (
    <div className="flex h-fit flex-1 flex-row py-0.5 font-medium">
      <Popover>
        <PopoverTrigger className="flex items-center justify-center rounded-md px-1 transition-colors hover:bg-[#eaeaea]/10">
          {userIcon.map((icon) => (
            <div style={icon.style} className="pl-0.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>{icon.icon}</TooltipTrigger>
                  <TooltipContent>{icon.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <div className="pl-1" style={{ color: color }}>
            {username}
            <span className="text-white">:&nbsp;</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="absolute -bottom-16 right-16 z-[99] flex h-fit w-80 flex-col rounded-sm border-none p-0 pt-3 dark:bg-[#292a2d]">
          <UserPopUp
            chatRoom={chatRoom}
            username={username}
            color={color}
            icons={userIcon}
          />
        </PopoverContent>
      </Popover>
      <div className="break-all">{message}</div>
    </div>
  );
};

export default Message;
