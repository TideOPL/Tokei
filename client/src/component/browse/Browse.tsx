import BrowseListItem from "~/component/browse/BrowseListItem";
import useBrowse from "~/hook/useBrowse";
import { ICategory } from "~/interface/Category";
import { Browse } from "~/interface/Channel";
import CategoryListItem from "./CategoryListItem";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { env } from "~/env.mjs";

// TODO: https://steamcdn-a.akamaihd.net/steam/apps/271590/library_600x900_2x.jpg
const Browse = (): JSX.Element => {
  const { browseItems, categoryItems, showMoreCategory } = useBrowse();
  return (
    <div className="w-full overflow-x-hidden">
      <div className="grid h-fit w-full grid-cols-5 justify-center px-10 pb-5 2xl:grid-cols-10">
        {categoryItems.map((category: ICategory) => (
          <CategoryListItem category={category} />
        ))}
      </div>
      <div className="relative w-full">
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="absolute -top-[10px] h-[20px] font-noto-sans font-semibold text-white transition-all dark:bg-zinc-600 hover:dark:bg-primary_lighter"
            onClick={() => showMoreCategory()}
          >
            Show More
          </Button>
        </div>
        <div className="px-12">
          <Separator
            orientation="horizontal"
            className="h-[2px] dark:bg-zinc-600"
          />
        </div>
      </div>
      {browseItems.length == 0 ? (
        <div className="w-full pt-10 text-center font-noto-sans dark:text-white">
          <div className="text-3xl font-semibold">Uh Oh!</div>
          <div className="text-xl font-semibold">
            It look's like there's no broadcasts at the moment!
          </div>
        </div>
      ) : (
        <div className="md: xl:px-15 grid h-full w-full justify-center gap-3 pb-5 pt-10 sm:grid-cols-1 sm:px-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
          {browseItems.map((channel: Browse) => (
            <BrowseListItem
              title={channel.stream.title}
              username={channel.channel.username}
              pfp={channel.channel.pfp}
              thumbnail={`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getThumbnail/${channel.channel.username}`}
              tags={channel.stream.tags}
              viewers={channel.stream.viewers}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Browse;
