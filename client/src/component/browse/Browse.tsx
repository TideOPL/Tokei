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
    <div>
      <div className="grid h-full w-full grid-cols-11 justify-center px-10 pb-5">
        {categoryItems.map((category: ICategory) => (
          <CategoryListItem category={category} />
        ))}
      </div>
      <div className="w-full px-10">
        <Separator
          orientation="horizontal"
          className="h-[2px] dark:bg-zinc-600"
        />
        <Button onClick={() => showMoreCategory()} />
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
