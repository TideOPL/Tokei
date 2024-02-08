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
}

const BrowseListItem = ({
  title,
  username,
  pfp,
  thumbnail,
  tags,
  viewers,
}: Props): JSX.Element => {
  return (
    <Link
      className="group flex h-60 w-80 flex-col rounded-lg px-5 py-1 transition-all hover:cursor-pointer hover:bg-light-primary-dark dark:hover:bg-dark-primary-light/50"
      href={`/${username}`}
    >
      <div className={"relative h-[175px] justify-start"}>
        <ImageWithFallback
          src={thumbnail}
          fallback="/placeholder-thumb.png"
          alt={"thumbnail"}
          className="rounded-lg"
          height={248}
          width={440}
        />
        <div className="absolute bottom-5 flex flex-row rounded-md bg-zinc-950/50 px-1 text-white ">
          <Eye className="mt-1 h-5" />
          &nbsp;{viewers} viewers
        </div>
      </div>
      <div className="flex w-max flex-row space-x-3.5">
        <div className="h-fit w-fit ">
          <Avatar className=" min-h-[32px] min-w-[32px] md:min-h-[42px] md:min-w-[42px]">
            <AvatarImage src={pfp} alt="profile" className="object-cover" />
            <AvatarFallback>{username.at(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex w-56 flex-col -space-y-1.5">
          <p className="... truncate font-noto-sans font-semibold transition-all group-hover:text-primary dark:text-white">
            {title}
          </p>
          <div className="font-noto-sans text-sm dark:text-gray-500">
            {username}
          </div>
          <div className="space-x-1 pt-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="w-fit rounded-xl">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BrowseListItem;
