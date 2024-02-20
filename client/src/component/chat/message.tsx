import { BadgeCheckIcon, SwordIcon, Video } from "lucide-react";
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
      <Video className="h-[22px] w-[22px] rounded-md fill-red-500 stroke-red-500 stroke-[1.75px]" />
    ),
    style: {},
  },
  {
    name: "Moderator",
    icon: (
      <SwordIcon className="h-[22px] w-[22px] rotate-90 rounded-md fill-[#B07ADF] stroke-white stroke-[1.75px]" />
    ),
    style: {},
  },
  {
    name: "Verified",
    icon: (
      <BadgeCheckIcon className="stroke-back-tertiary h-[22px] w-[22px] rounded-md fill-primary stroke-[1.75px]" />
    ),
    style: {},
  },
];

const Message = ({ icons, username, message, color, chatRoom }: Message) => {
  const userIcon = IconsList.filter((item) => icons.includes(item.name));

  return (
    <div
      key={`${username}_${Date.now()}_${message}`}
      className="group mb-1 h-fit whitespace-pre-line break-words rounded-md py-0.5 pl-1 font-medium transition-all hover:bg-zinc-800/50 "
    >
      <Popover>
        <PopoverTrigger className="inline-block h-[32px] min-h-[137.75] flex-row rounded-md px-1 transition-colors hover:bg-[#eaeaea]/10">
          <div className="flex h-full flex-row items-baseline pb-2 pt-1">
            {userIcon.map((icon) => (
              <div style={icon.style} className="self-center pl-0.5 pt-1">
                {icon.icon}
              </div>
            ))}
            <span className="pl-0.5 text-sm font-bold" style={{ color: color }}>
              {username}
              <span className="text-white">:</span>
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="dark:bg-back-primary absolute -bottom-16 right-16 z-[99] flex h-fit w-80 flex-col rounded-sm border-none p-0 pt-3">
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
