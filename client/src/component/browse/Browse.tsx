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
      <div className="flex pl-16 font-noto-sans text-2xl font-semibold text-white">
        Categories
      </div>
      <div className="grid h-fit w-full grid-cols-5 justify-center px-10 pb-5 2xl:grid-cols-10">
        {categoryItems.map((category: ICategory) => (
          <CategoryListItem category={category} />
        ))}
      </div>
      <div className="relative w-full">
        <div className="flex justify-center">
          <Button
            variant="link"
            className="absolute -top-[10px] h-[20px] rounded-md font-noto-sans font-semibold transition-all hover:no-underline dark:bg-[#141516] dark:text-zinc-500 hover:dark:text-white"
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
        <div className="relative bottom-2 pt-5">
          <div className="absolute flex pb-3 pl-16 font-noto-sans text-2xl font-semibold text-primary">
            Live Channels
          </div>
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
        <div className="grid h-full w-full justify-center pb-5 pl-3 pt-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[1800px]:grid-cols-5 min-[2000px]:grid-cols-6">
          {browseItems.map((channel: Browse) => (
            <BrowseListItem
              title={channel.stream.title}
              username={channel.channel.username}
              pfp={channel.channel.pfp}
              thumbnail={`${env.NEXT_PUBLIC_SSR_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getThumbnail/${channel.channel.username}`}
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
