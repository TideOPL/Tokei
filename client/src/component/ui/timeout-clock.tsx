import { Clock1, Clock5Icon } from "lucide-react";
import React, { useState, useEffect } from "react";

const TimeoutClock = ({
  timestamp,
  changeState,
}: {
  timestamp: string;
  changeState?: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const calculateTimeRemaining = () => {
    const remainingTime = parseInt(timestamp) - Date.now();
    if (remainingTime <= 0 && changeState) {
      changeState(null);
      return "00:00:00";
    }
    const totalSeconds = Math.floor(remainingTime / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const [time, setTime] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [timestamp]);

  return (
    <div
      className={
        "time flex min-w-[81.11px] flex-row font-semibold transition-all dark:text-white"
      }
    >
      {time}
    </div>
  );
};

export default TimeoutClock;
