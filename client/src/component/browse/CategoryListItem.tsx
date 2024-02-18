import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ICategory } from "~/interface/Category";
import Link from "next/link";
import { Badge } from "../ui/badge";
import ImageWithFallback from "../ui/fallback-image";

interface Props {
  category: ICategory;
}

const CategoryListItem = ({ category }: Props): JSX.Element => {
  return (
    <Link
      className="group relative flex h-full w-full flex-col items-center justify-between justify-self-center overflow-hidden overflow-x-hidden overflow-y-hidden rounded-lg px-2 py-2 transition-all hover:cursor-pointer hover:bg-light-primary-dark dark:hover:bg-dark-primary-light/5"
      href={`/category/${category.name.toLowerCase().replaceAll("'", "").replaceAll(":", "").replaceAll(" ", "-")}`}
    >
      <div
        className={
          "min-[1900]:min-h-[70%] min-[2000px]:min-h-[80%] relative flex min-h-[65%] w-full items-center justify-items-center rounded-xl"
        }
      >
        <ImageWithFallback
          src={category.image}
          alt={"thumbnail"}
          className="rounded-lg border-primary object-fill transition-all group-hover:border-4"
          fill={true}
          fallback={"/placeholder-category.png"}
        />
      </div>
      <div className="h-full w-full flex-row space-x-3.5 overflow-hidden">
        <div className="flex w-full flex-col overflow-hidden text-left">
          <p className="... w-[75%] overflow-hidden truncate font-noto-sans font-semibold transition-all group-hover:text-primary dark:text-white">
            {category.name}
          </p>
          <div className="... w-[75%] overflow-hidden truncate pb-[8px] font-noto-sans text-sm dark:text-gray-500">
            {category.developer?.split(",")[0] || ""}
          </div>
          <div className="flex max-h-[24.5px] flex-wrap space-x-1 overflow-hidden">
            {category.tags.slice(0, 2).map((tag) => (
              <div className="block">
                <Badge
                  key={tag}
                  variant="secondary"
                  className="w-fit rounded-xl text-xs font-semibold dark:text-zinc-500 hover:dark:text-white"
                >
                  {tag}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryListItem;
