import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { FaRegFaceGrin, FaRegHeart, FaGlobe, FaX } from "react-icons/fa6";
import { Input } from "../ui/input";
import { FaSearch } from "react-icons/fa";
import { PopoverClose } from "@radix-ui/react-popover";
import { useState } from "react";

const emotes = [
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

const ChatEmotes = () => {
  const [search, setSearch] = useState<string>("");
  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-[#eaeaea]/10 ">
        <FaRegFaceGrin className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="flex h-[40vh] w-[18vw] flex-col rounded-sm border-none p-0 pt-3 dark:bg-[#141516] ">
        <div className="title sticky top-0 z-10 flex h-fit w-full  flex-col border-b-[4px] border-b-zinc-700 font-noto-sans ">
          <div className="mb-5 text-center font-bold uppercase">Emojis</div>
          <div className="flex h-10 flex-col border-t-[4px] border-t-zinc-700 pb-16 pr-8 dark:bg-[#1f2023]">
            <div className="flex flex-col px-4 text-zinc-400">
              <div className="relative">
                <div className="absolute left-2 top-[1.4rem] flex flex-col">
                  <FaSearch />
                </div>
                <div className="absolute -right-10 top-[0.85rem] flex flex-row">
                  <PopoverClose asChild>
                    <Button
                      variant={"link"}
                      className="group h-8 w-8 fill-zinc-400 px-2 py-1  transition-all hover:rounded-md hover:bg-zinc-700"
                      onClick={() => setSearch("")}
                    >
                      <FaX className="h-full w-full group-hover:fill-primary" />
                    </Button>
                  </PopoverClose>
                </div>
                <Input
                  type="text"
                  className="mt-3 flex select-text flex-row items-center justify-center break-all rounded-sm bg-[#eaeaea]/10 p-1 pl-8"
                  onChange={(event) => setSearch(event.currentTarget.value)}
                />
              </div>
              {/*<FaX className="flex flex-row justify-end " />*/}

              <div className="mt-2 flex flex-row px-2">
                {/* <Button variant={"link"} className="px-3">
                  <FaRegHeart className="flex h-5 w-5 fill-zinc-400 transition-colors hover:fill-primary" />
                </Button>

                <Button variant={"link"} className="px-3">
                  <FaGlobe className="flex h-5 w-5 fill-zinc-400 transition-colors hover:fill-primary" />
                </Button>
  */}
              </div>
            </div>
          </div>
        </div>

        <div className="h-full overflow-x-hidden overflow-y-scroll px-2">
          <div className="color">
            <div className="text-zinc-400">Chat Color</div>
            <div className="grid grid-flow-row grid-cols-8 gap-2"></div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChatEmotes;
