import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { FaRegFaceGrin, FaX } from "react-icons/fa6";
import { PopoverClose } from "@radix-ui/react-popover";
import { useState } from "react";
import { useAppSelector } from "~/store/hooks";

interface Props {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setDisableHotkey: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatEmotes = ({ setMessage, setDisableHotkey }: Props) => {
  const [search, setSearch] = useState<string>("");
  const emotes = useAppSelector((state) => state.emotes);

  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-[#eaeaea]/10 ">
        <FaRegFaceGrin className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="dark:bg-back-tertiary mb-5 flex h-[40vh] w-[18vw] flex-col rounded-sm border-none p-0 pt-3">
        <div className="title dark:bg-back-tertiary relative top-0 z-10 flex  h-fit w-full flex-col border-b-[2px] border-b-zinc-700 font-noto-sans">
          <div className="relative mb-5 text-center font-bold uppercase">
            Emotes
          </div>
          <div className="absolute right-5 flex flex-row">
            <PopoverClose asChild>
              <Button
                variant={"link"}
                className="group h-[1.8rem] w-[1.8rem] fill-zinc-400 px-2 py-1  transition-all hover:rounded-md hover:bg-zinc-700"
                onClick={() => setSearch("")}
              >
                <FaX className="h-full w-full group-hover:fill-primary" />
              </Button>
            </PopoverClose>
          </div>
          {/* <div className="flex h-10 flex-col pb-16 pr-2 dark:bg-back-secondary">
            <div className="flex flex-col px-4 text-zinc-400">
              <div className="relative">
                <div className="absolute left-2 top-[1.4rem] flex flex-col">
                  <FaSearch className="fill-white" />
                </div>
                <Input
                  onFocus={() => setDisableHotkey(true)}
                  onBlur={() => setDisableHotkey(false)}
                  type="text"
                  className="mt-3 h-9 w-full max-w-lg select-text break-all rounded-none border-none pl-10 focus:bg-none dark:bg-[#eaeaea]/5"
                  onChange={(event) => setSearch(event.currentTarget.value)}
                />
              </div>
              <div className="mt-2 flex flex-row px-2">
                <Button variant={"link"} className="px-3">
                  <FaRegHeart className="flex h-5 w-5 fill-zinc-400 transition-colors hover:fill-primary" />
                </Button>

                <Button variant={"link"} className="px-3">
                  <FaGlobe className="flex h-5 w-5 fill-zinc-400 transition-colors hover:fill-primary" />
                </Button>
 
              </div>
            </div>
          </div> */}
        </div>

        <div className="h-full overflow-x-hidden overflow-y-scroll px-2">
          <div className="color">
            <div className="text-zinc-400">Chat Emotes</div>
            <div className="grid grid-flow-row grid-cols-8 gap-2">
              {emotes.emotes.map((emote) => (
                <Button
                  key={emote.name}
                  variant={"ghost"}
                  className="text-xl antialiased"
                  onClick={() => setMessage((prev) => prev + emote.emote)}
                >
                  {emote.emote}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ChatEmotes;
