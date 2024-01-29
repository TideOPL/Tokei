import { Settings, Star } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Button } from "../ui/button";
import { useEffect } from "react";
import { UserResource } from "@clerk/types";
import { env } from "~/env.mjs";
import axios from "axios";
import { log } from "console";

interface Props {
  user: UserResource
  initialColor: string
  getToken: () => Promise<string | null>
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

const colors = [
  'FF0000', // Red
  'FF6347', // Tomato (Close to Orange)
  'FFA500', // Orange
  'FF66B2', // Pink
  'FF00FF', // Magenta
  'DC143C', // Crimson
  'DB7093', // PaleVioletRed
  'B07ADF', // MediumPurple
  '7AA2DF', // LightSkyBlue
  '7ADFD5', // MediumTurquoise
  '7AF667', // Aquamarine
  'F2FD5B', // PaleGreen
  'FAB81D', // DarkOrange
  'FFCC99', // PeachPuff
  '6B8E23', // OliveDrab
  '32CD32', // LimeGreen
  '20B2AA', // LightSeaGreen
  '00CED1', // DarkTurquoise
  '6495ED', // CornflowerBlue
  '4169E1', // RoyalBlue
  '87CEFA', // LightSkyBlue
  '00FA9A', // MediumSpringGreen
  '00FF00', // Green
  'FF1493', // DeepPink
  'B62BB6', // MediumSlateBlue

];



const ChatIdentity = ({ user, initialColor, getToken, setColor}: Props) => {
  useEffect(() => {
    setColor(user?.publicMetadata.color as string);
  }, [])

  const updateColor = async (color: string) => {
    console.log(initialColor)
    console.log(color);
    if ('#' + color == initialColor) {
      return;
    }
    
    setColor('#' + color)
    const token = await getToken();
    await axios.post(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/settings/setColor?color=${color}`, {}, { headers: { 'Authorization': `Bearer ${token}`}}).catch(() => {
      setColor(initialColor);
    })
  }
  
  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center hover:bg-[#eaeaea]/10 p-1 rounded-md transition-colors">
        <Star className='h-5 w-5'/>
      </PopoverTrigger>
      <PopoverContent className="dark:bg-[#141516] border-none w-[18vw] h-[40vh] mr-10 rounded-sm flex flex-col p-0 pt-3">
        <div className="title sticky top-0 z-10 font-noto-sans flex flex-col  w-full h-fit border-b-[1px] border-b-zinc-700 ">
          <div className="uppercase font-bold mb-5 text-center">
            Chat Identity
          </div>
          <div className="flex flex-col px-2 text-zinc-400">
            <div className="">
              Chat Preview
            </div>
            <div className="text-sm text-white font-light pb-1">
              Currently, your chat identity looks like this.
            </div>
            <div className="text-sm font-medium pb-2" style={{ color: initialColor }}>
              {user.username}<span className="text-white font-normal">: Hello!</span>
            </div>
          </div>
        </div>
        <div className="px-2 h-full overflow-y-scroll overflow-x-hidden">
          <div className="color">
            <div className="text-zinc-400">
              Chat Color
            </div>
            <div className="grid grid-flow-row grid-cols-8 gap-2">
              {colors.map((color: string) => (
                <Button onClick={async () => await updateColor(color)} variant={'link'} style={{background: "#"+color, borderColor: color == initialColor ? 'rgb(39 39 42)' : 'rgb(63 63 70)'}} className="rounded-full p-0 w-[24px] h-6 border-zinc-700 border-[3px]" />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

}

export default ChatIdentity;