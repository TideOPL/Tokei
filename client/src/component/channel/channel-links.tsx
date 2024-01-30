import { Button } from "../ui/button";

const ChannelLink = () => {
  return (
    <div className="flex w-full items-center justify-center pb-10">
      <div className="mt-2 flex h-fit w-[85%] flex-row justify-between rounded-lg bg-zinc-600/20 px-5 py-5 shadow-md">
        <div className="relative flex flex-row space-x-2 pt-1">
          <Button
            variant="link"
            className="min-h-fit min-w-[60px] font-semibold dark:text-primary"
          >
            About
          </Button>
          <Button
            variant="link"
            className="min-h-fit min-w-[60px] font-semibold dark:text-primary"
          >
            Chat
          </Button>
          <Button
            variant="link"
            className="min-h-fit min-w-[60px] font-semibold dark:text-primary"
          >
            Videos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChannelLink;
