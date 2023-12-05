import Image from "next/image";

interface Props {
    title: string;
    username: string;
    pfp: string;
    thumbnail: string;

}

const BrowseListItem = ({title, username, pfp, thumbnail}: Props): JSX.Element => {
    return (
        <div className="flex flex-col group h-60 w-80 py-1 px-5 rounded-lg transition-all hover:bg-light-primary-dark dark:hover:bg-dark-primary-light/50 hover:cursor-pointer">
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
                <div className="h-fit w-fit">
                  <Image src={pfp} height={32} width={32} className="rounded-full" alt={username}/>
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
            </div>
    )
}

export default BrowseListItem;