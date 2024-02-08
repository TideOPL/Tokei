import { Eye, EyeIcon } from "lucide-react";

interface Props {
  viewers: string;
}

const Viewers = ({ viewers }: Props) => {
  return (
    <div className="viewers flex flex-row font-semibold transition-all dark:text-red-400">
      <Eye className="mr-1 mt-[1px] h-4 w-4 self-center" />
      {viewers}
    </div>
  );
};

export default Viewers;
