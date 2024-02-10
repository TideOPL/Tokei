import ReactPlayer from "react-player";
import PlayerControls from "./player-controls";
import { useEffect, useRef, useState } from "react";
import { env } from "~/env.mjs";

interface Props {
  channel: string;
  disableControls: boolean;
}

const TokeiPlayer = ({ channel, disableControls }: Props) => {
  const [volume, setVolume] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return (
    hasWindow && (
      <div id="TokeiVideo" className="group relative pt-[56.25%]">
        <ReactPlayer
          url={`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/${channel}/index.m3u8`}
          style={{ position: "absolute", top: 0, left: 0 }}
          playing={playing}
          muted={muted}
          volume={volume}
          height={"100%"}
          width={"100%"}
        />
        <PlayerControls
          state={playing}
          volume={volume}
          setMuted={setMuted}
          setVolume={setVolume}
          setState={setPlaying}
          disableControls={disableControls}
        />
      </div>
    )
  );
};

export default TokeiPlayer;
