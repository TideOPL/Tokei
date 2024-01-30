import { BadgeCheckIcon, GemIcon, Shield, SwordIcon, VideoIcon } from "lucide-react"
import { Button } from "../ui/button"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { CSSProperties } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import UserPopUp from "./user-popup"

interface Message {
  username: string
  message: string
  color: string
  icons: string[]
}

export interface IconProp {
  name: string
  icon: JSX.Element
  style: CSSProperties
}

const IconsList: IconProp[] = [
  {
    "name": "Broadcaster",
    "icon": <VideoIcon className="w-[24px] h-[24px] stroke-[1.75px] bg-red-500 px-0.5 rounded-md"/>,
    "style": {}
  },
  {
    "name": "Moderator",
    "icon": <SwordIcon  className="w-[24px] h-[24px] stroke-[1.75px] rotate-90 bg-[#B07ADF] rounded-md px-0.5 z-0"/>,
    "style": {},
  },
  {
    "name": "Verified",
    "icon": <BadgeCheckIcon  className="w-[24px] h-[24px] stroke-[1.75px] bg-primary rounded-md px-0.5"/>,
    "style": {},
  },
]

const Message = ({ icons, username, message, color }: Message) => {
  

  const userIcon = IconsList.filter(item => icons.includes(item.name));

  return (
    <div className="flex flex-1 flex-row h-fit font-medium py-0.5">
      <Popover>
          <PopoverTrigger  className="flex items-center justify-center hover:bg-[#eaeaea]/10 px-1 rounded-md transition-colors">
            {userIcon.map((icon) => (
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
            <div className="pl-1" style={{color: color}}>
              {username}<span className="text-white">:&nbsp;</span>
            </div>
          </PopoverTrigger>
        <PopoverContent className="absolute right-16 -bottom-16 dark:bg-[#292a2d] border-none w-80 h-fit rounded-sm flex flex-col p-0 pt-3 z-[99]">
          <UserPopUp username={username} color={color} icons={userIcon} />
        </PopoverContent>
      </Popover>
      <div className="break-all">
        {message}
      </div>
    </div>
  )
}

export default Message