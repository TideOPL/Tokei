import { Settings, Star } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { UserResource } from "@clerk/types";
import { env } from "~/env.mjs";
import axios from "axios";
import { log } from "console";

interface Props {
  user: UserResource;
  initialColor: string;
  getToken: () => Promise<string | null>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

const colors = [
  "FF0000", // Red
  "FF6347", // Tomato (Close to Orange)
  "FFA500", // Orange
  "FF66B2", // Pink
  "FF00FF", // Magenta
  "DC143C", // Crimson
  "DB7093", // PaleVioletRed
  "B07ADF", // MediumPurple
  "7AA2DF", // LightSkyBlue
  "7ADFD5", // MediumTurquoise
  "7AF667", // Aquamarine
  "F2FD5B", // PaleGreen
  "FAB81D", // DarkOrange
  "FFCC99", // PeachPuff
  "6B8E23", // OliveDrab
  "32CD32", // LimeGreen
  "20B2AA", // LightSeaGreen
  "00CED1", // DarkTurquoise
  "6495ED", // CornflowerBlue
  "4169E1", // RoyalBlue
  "87CEFA", // LightSkyBlue
  "00FA9A", // MediumSpringGreen
  "00FF00", // Green
  "FF1493", // DeepPink
  "B62BB6", // MediumSlateBlue
];

const ChatIdentity = ({ user, initialColor, getToken, setColor }: Props) => {
  useEffect(() => {
    setColor(user?.publicMetadata.color as string);
  }, []);

  const updateColor = async (color: string) => {
    console.log(initialColor);
    console.log(color);
    if ("#" + color == initialColor) {
      return;
    }

    setColor("#" + color);
    const token = await getToken();
    await axios
      .post(
        `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/settings/setColor?color=${color}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .catch(() => {
        setColor(initialColor);
      });
  };

  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-[#eaeaea]/10">
        <Star className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="mr-10 flex h-[40vh] w-[18vw] flex-col rounded-sm border-none p-0 pt-3 dark:bg-[#141516]">
        <div className="title sticky top-0 z-10 flex h-fit w-full  flex-col border-b-[1px] border-b-zinc-700 font-noto-sans ">
          <div className="mb-5 text-center font-bold uppercase">
            Chat Identity
          </div>
          <div className="flex flex-col px-2 text-zinc-400">
            <div className="">Chat Preview</div>
            <div className="pb-1 text-sm font-light text-white">
              Currently, your chat identity looks like this.
            </div>
            <div
              className="pb-2 text-sm font-medium"
              style={{ color: initialColor }}
            >
              {user.username}
              <span className="font-normal text-white">: Hello!</span>
            </div>
          </div>
        </div>
        <div className="h-full overflow-x-hidden overflow-y-scroll px-2">
          <div className="color">
            <div className="text-zinc-400">Chat Color</div>
            <div className="grid grid-flow-row grid-cols-8 gap-2">
              {colors.map((color: string) => (
                <Button
                  onClick={async () => await updateColor(color)}
                  variant={"link"}
                  style={{
                    background: "#" + color,
                    borderColor:
                      color == initialColor ? "rgb(39 39 42)" : "rgb(63 63 70)",
                  }}
                  className="h-6 w-[24px] rounded-full border-[3px] border-zinc-700 p-0"
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChatIdentity;
