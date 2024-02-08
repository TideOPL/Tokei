import { StarFilledIcon } from "@radix-ui/react-icons";
import { UserRound } from "lucide-react";
import { Button } from "../ui/button";
import useFollow from "~/hook/useFollow";

interface Props {
  following: boolean | undefined;
  follow: () => void;
}

const FollowContainer = ({ following, follow }: Props) => {
  return (
    <div className="flex flex-row items-center justify-end gap-x-2 py-2">
      {following ? (
        <Button
          className="min-w-fit px-3 font-semibold dark:bg-primary dark:text-white hover:dark:bg-primary_lighter"
          onClick={() => follow()}
        >
          <UserRound className="mt-[1px] h-4 w-4 self-center" />
        </Button>
      ) : (
        <Button
          className="min-w-[93.92px] font-semibold dark:bg-primary dark:text-white hover:dark:bg-primary_lighter"
          onClick={() => follow()}
        >
          <UserRound className="mr-1 mt-[1px] h-4 w-4 self-center" /> Follow
        </Button>
      )}
      <Button className="min-w-[93.92px] font-semibold dark:bg-blue-500 dark:text-white hover:dark:bg-primary_lighter">
        <StarFilledIcon className="mr-1 mt-[1px] h-4 w-4 self-center" />{" "}
        {following ? "Subscribe" : "Subscribe"}
      </Button>
    </div>
  );
};

export default FollowContainer;
