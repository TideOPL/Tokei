import React, { RefObject } from "react";
import { Button } from "../ui/button";
import {
  MaximizeIcon,
  PauseIcon,
  PlayIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { Slider } from "../ui/slider";
import ReactPlayer from "react-player";
import { useKeyPress } from "~/hook/useKeyPress";

interface Props {
  state: boolean;
  volume: number;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerControls = ({
  state,
  setState,
  volume,
  setVolume,
  setMuted,
}: Props) => {
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }

    document.getElementById("TokeiVideo")?.requestFullscreen();
  };

  useKeyPress(() => toggleFullscreen(), ["KeyF"]);
  useKeyPress(() => document.exitFullscreen, ["Escape"]);
  useKeyPress(() => setMuted((prev) => !prev), ["KeyM"]);

  return (
    <div className="absolute top-0 z-10 h-[100%] w-full flex-col  bg-transparent p-5 opacity-0 transition-all group-hover:opacity-100 ">
      <div className="flex w-full justify-end">
        <div className="rounded-lg bg-primary  px-1 py-0.5 font-noto-sans font-bold text-white ">
          LIVE
        </div>
      </div>
      <div className="flex h-[98%] items-end justify-between">
        <div className="flex h-36 items-end">
          <div className="play">
            {state == true ? (
              <Button
                variant={"link"}
                className="min-w-fit px-3 font-semibold dark:text-white"
                onClick={() => setState(!state)}
              >
                <PauseIcon />
              </Button>
            ) : (
              <Button
                variant={"link"}
                className="min-w-fit px-3 font-semibold dark:text-white"
                onClick={() => setState(!state)}
              >
                <PlayIcon />
              </Button>
            )}
          </div>
          <div className="volume h-full w-20">
            <div className="group/volume relative flex h-full flex-col justify-end space-x-2 pb-1.5">
              <div className="absolute bottom-8 left-2 hidden group-hover/volume:flex">
                <Slider
                  defaultValue={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={(value: number) => {
                    if (value == 0) {
                      setMuted(true);
                      setVolume(value);
                      return;
                    }
                    setMuted(false);
                    setVolume(value);
                  }}
                />
              </div>
              <div>
                {volume == 0 ? (
                  <VolumeXIcon className="min-w-fit font-semibold dark:text-white" />
                ) : volume >= 0.5 ? (
                  <Volume2Icon className="min-w-fit font-semibold dark:text-white" />
                ) : (
                  <Volume1Icon className="min-w-fit font-semibold dark:text-white" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-36 items-end">
          <Button
            variant={"link"}
            className="min-w-fit px-3 font-semibold dark:text-white"
            onClick={() => toggleFullscreen()}
          >
            <MaximizeIcon className="min-w-fit font-semibold dark:text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
