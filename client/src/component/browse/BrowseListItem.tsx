import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Eye } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import ImageWithFallback from "../ui/fallback-image";

interface Props {
  title: string;
  username: string;
  pfp: string;
  thumbnail: string;
  tags: string[];
  viewers: string;
  category: string;
}

const BrowseListItem = ({
  title,
  username,
  pfp,
  thumbnail,
  tags,
  viewers,
  category,
}: Props): JSX.Element => {
  const categoryData = JSON.parse(category);
  return (
    <Link
      className="group flex h-fit w-80 flex-col rounded-lg px-5 py-1 transition-all hover:cursor-pointer hover:bg-light-primary-dark dark:hover:bg-dark-primary-light/50"
      href={`/${username}`}
    >
      <div className={"relative h-fit justify-start pb-2"}>
        <div className="absolute left-1 top-1 flex max-h-[28px] flex-row rounded-md bg-zinc-800 px-[5px] py-[2px] text-[13px] font-semibold text-primary">
          LIVE
        </div>
        <ImageWithFallback
          src={thumbnail}
          fallback="/placeholder-thumb.png"
          alt={title}
          className="rounded-lg"
          height={248}
          width={440}
        />
        <div className="absolute bottom-5 flex flex-row rounded-md bg-zinc-950/50 px-1 text-white ">
          <Eye className="mt-1 h-5" />
          &nbsp;{viewers} viewers
        </div>
      </div>
      <div className="flex w-max flex-col space-y-1.5">
        <div className="flex h-fit w-fit flex-row items-center space-x-1.5">
          <Avatar className="h-[32px] w-[32px]">
            <AvatarImage src={pfp} alt="profile" className="object-cover" />
            <AvatarFallback>{username.at(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="font-noto-sans text-sm font-semibold dark:text-gray-500">
            {username}
          </div>
        </div>
        <div className="flex w-56 flex-col">
          <p className="... truncate font-noto-sans text-base font-semibold transition-all group-hover:text-primary dark:text-white">
            {title}
          </p>
          <div>
            <Link
              href={"/category/" + categoryData.searchName}
              className="... dark:text=gray-500 truncate font-noto-sans text-sm font-semibold transition-all hover:text-primary dark:text-gray-500"
            >
              {categoryData.name}
            </Link>
            <div className="space-x-1 pt-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="w-fit rounded-xl"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BrowseListItem;
