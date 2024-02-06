import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  title: string;
  username: string;
  pfp: string;
  thumbnail: string;
}

const BrowseListItem = ({
  title,
  username,
  pfp,
  thumbnail,
}: Props): JSX.Element => {
  return (
    <a
      className="group flex h-60 w-80 flex-col rounded-lg px-5 py-1 transition-all hover:cursor-pointer hover:bg-light-primary-dark dark:hover:bg-dark-primary-light/50"
      href={`/${username}`}
    >
      <div className={"relative h-48 justify-start"}>
        <Image
          src={thumbnail}
          alt={"thumbnail"}
          className="rounded-lg"
          height={248}
          width={440}
          objectFit={"contain"}
        />
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
        </div>
      </div>
    </a>
  );
};

export default BrowseListItem;
