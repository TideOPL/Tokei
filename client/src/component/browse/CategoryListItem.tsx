import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ICategory } from "~/interface/Category";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface Props {
  category: ICategory;
}

const CategoryListItem = ({ category }: Props): JSX.Element => {
  return (
    <Link
      className="group relative flex h-52 w-fit flex-col justify-self-center overflow-x-hidden overflow-y-hidden rounded-lg p-5 transition-all hover:cursor-pointer hover:bg-light-primary-dark dark:hover:bg-dark-primary-light/5 lg:h-[19rem]"
      href={`/category/${category.name.toLowerCase().replaceAll("'", "").replaceAll(":", "").replaceAll(" ", "-")}`}
    >
      <div
        className={"h-52 w-fit justify-start rounded-xl md:h-32 2xl:h-[15vh]"}
      >
        <Image
          src={category.image}
          alt={"thumbnail"}
          className="h-full max-h-[200px] w-full max-w-[145px] rounded-lg border-primary object-fill transition-all group-hover:border-4 lg:h-[225px] lg:min-w-[150px]"
          width={145}
          height={200}
        />
      </div>
      <div className="absolute bottom-0 flex w-full flex-row space-x-3.5">
        <div className="flex w-full flex-col text-left">
          <p className="... w-[75%] truncate font-noto-sans font-semibold transition-all group-hover:text-primary dark:text-white">
            {category.name}
          </p>
          <div className="... w-[75%] truncate pb-[8px] font-noto-sans text-sm dark:text-gray-500">
            {category.developer?.split(",")[0] || ""}
          </div>
          <div className="space-x-1">
            {category.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="w-fit rounded-xl text-xs font-semibold dark:text-zinc-500 hover:dark:text-white"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryListItem;
