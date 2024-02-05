import BrowseListItem from "~/component/browse/BrowseListItem";
import useBrowse from "~/hook/useBrowse";
import { ICategory } from "~/interface/Category";
import { Browse } from "~/interface/Channel";
import CategoryListItem from "./CategoryListItem";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

// TODO: https://steamcdn-a.akamaihd.net/steam/apps/271590/library_600x900_2x.jpg
const Browse = (): JSX.Element => {
  const { browseItems, categoryItems, showMoreCategory } = useBrowse();
  return (
    <div className="overflow-x-hidden">
      <div className="grid h-full w-full grid-cols-11 justify-center px-10 pb-5">
        {categoryItems.map((category: ICategory) => (
          <CategoryListItem category={category} />
        ))}
      </div>
      <div className="w-full ">
        <div className="absolute flex w-full items-center justify-center">
          <Button
            variant="ghost"
            className="absolute -top-[10px] h-[20px] font-noto-sans font-semibold text-white transition-all dark:bg-zinc-600 hover:dark:bg-primary_lighter"
            onClick={() => showMoreCategory()}
          >
            Show More
          </Button>
          {/* mt-[-11px] h-[20px] font-noto-sans font-semibold text-white
          transition-all dark:bg-zinc-600 hover:dark:bg-primary_lighter */}

          {/* group mt-[-11px] h-[20px] rounded-lg border-primary font-noto-sans font-semibold text-white transition-colors hover:border-2 dark:bg-zinc-600 hover:dark:bg-zinc-600 hover:dark:text-primary */}
        </div>
        <div className="px-12">
          <Separator
            orientation="horizontal"
            className="h-[2px] dark:bg-zinc-600"
          />
        </div>
      </div>
      <div className="md: xl:px-15 grid h-full w-full justify-center gap-3 pb-5 sm:grid-cols-1 sm:px-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        {browseItems.map((channel: Browse) => (
          <BrowseListItem
            title={channel.stream.streamTitle}
            username={channel.channel.username}
            pfp={channel.channel.pfp}
            thumbnail="/live_user_ibai-440x248.jpg"
          />
        ))}
      </div>
    </div>
  );
};

export default Browse;
