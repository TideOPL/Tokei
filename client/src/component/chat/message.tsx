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
      <SwordIcon className="h-[24px] w-[24px] rotate-90 rounded-md bg-[#B07ADF] stroke-[1.75px] px-0.5" />
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
    <div className="h-fit whitespace-pre-line break-words py-0.5 pl-1 font-medium ">
      <Popover>
        <PopoverTrigger className="inline-block h-[32px] min-h-[137.75] flex-row rounded-md px-1 transition-colors hover:bg-[#eaeaea]/10">
          <div className="flex h-full flex-row items-baseline pb-2 pt-1">
            {userIcon.map((icon) => (
              <div style={icon.style} className="self-center pl-0.5 pt-1">
                {icon.icon}
              </div>
            ))}
            <span className="pl-2" style={{ color: color }}>
              {username}
              <span className="text-white">:&nbsp;</span>
            </span>
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
      <span className="min-h-[42px]">{message}</span>
    </div>
  );
};

export default Message;
