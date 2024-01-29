import { Eye, EyeIcon } from "lucide-react";

interface Props {
  viewers: number
}

const Viewers = ({ viewers }: Props) => {
  return (
    <div className="viewers dark:text-red-400 font-semibold transition-all flex flex-row">
      <Eye className="mr-1 h-4 w-4 mt-[1px] self-center" />
      {viewers}
    </div>
  )
}

export default Viewers;