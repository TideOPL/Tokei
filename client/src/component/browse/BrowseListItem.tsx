import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
    title: string;
    username: string;
    pfp: string;
    thumbnail: string;

}

const BrowseListItem = ({title, username, pfp, thumbnail}: Props): JSX.Element => {
    return (
        <a className="flex flex-col group h-60 w-80 py-1 px-5 rounded-lg transition-all hover:bg-light-primary-dark dark:hover:bg-dark-primary-light/50 hover:cursor-pointer" href={`/${username}`}>
            <div className={"h-48 justify-start relative"}>
                <Image
                    src={thumbnail}
                    alt={'thumbnail'}
                    className="rounded-lg"
                    fill
                    objectFit={'contain'}
                />
            </div>
            <div className="flex flex-row w-max space-x-3.5">
              <div className="h-fit w-fit ">
                <Avatar className=" min-w-[32px] min-h-[32px] md:min-w-[42px] md:min-h-[42px]">
                      <AvatarImage src={pfp} alt="profile" className="object-cover"/>
                      <AvatarFallback>{username.at(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col -space-y-1.5 w-56">
                <p className="font-noto-sans font-semibold transition-all group-hover:text-primary dark:text-white truncate ...">
                    {title}
                </p>
                <div className="font-noto-sans text-sm dark:text-gray-500">
                    {username}
                </div>
              </div>
            </div>
          </a>
  )
}

export default BrowseListItem;