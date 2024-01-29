import { Clock1, Clock5Icon } from "lucide-react";
import { useState } from "react";

const Clock = ({timestamp}: {timestamp: string}) => {
  const date = new Date();
  const [time, setTime] = useState("00:00:00");
  

  setTimeout(() => {
    const currentTimestamp = Date.now();
    const elapsedTime = currentTimestamp - parseInt(timestamp);

    const totalSeconds = Math.floor(elapsedTime / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    
    setTime(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
  }, 1000)

  return (
    <div className="time flex flex-row dark:text-white font-semibold transition-all min-w-[81.11px]">
      <Clock5Icon className="mr-1 h-4 w-4 mt-[1px] self-center" />
      {time}
      {/* 23:59:59 */}
    </div>
  )
}

export default Clock;