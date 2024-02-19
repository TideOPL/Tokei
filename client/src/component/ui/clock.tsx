import { Clock1, Clock5Icon } from "lucide-react";
import React from "react";
import { useState } from "react";

const Clock = ({ timestamp }: { timestamp: string }) => {
  const [time, setTime] = useState("00:00:00");

  setTimeout(() => {
    const currentTimestamp = Date.now();
    const elapsedTime = currentTimestamp - parseInt(timestamp);

    const totalSeconds = Math.floor(elapsedTime / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    setTime(
      `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    );
  }, 1000);

  return (
    <div
      className={
        "time flex min-w-[81.11px] flex-row font-semibold transition-all dark:text-white"
      }
    >
      <Clock5Icon className="mr-1 mt-[1px] h-4 w-4 self-center" />
      {time}
    </div>
  );
};

export default Clock;
