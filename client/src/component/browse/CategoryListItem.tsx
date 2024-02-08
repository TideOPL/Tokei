import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ICategory } from "~/interface/Category";

interface Props {
  category: ICategory;
}

const CategoryListItem = ({ category }: Props): JSX.Element => {
  return (
    <a
      className="group relative flex w-fit flex-col justify-self-center overflow-x-hidden overflow-y-hidden rounded-lg p-5 transition-all hover:cursor-pointer hover:bg-light-primary-dark dark:hover:bg-dark-primary-light/5 md:h-fit lg:h-fit xl:h-fit 2xl:h-fit min-[1920px]:h-64 min-[2160px]:h-72"
      href={`/category/${category.name.toLowerCase().replaceAll("'", "").replaceAll(":", "").replaceAll(" ", "-")}`}
    >
      <div className={"h-[23vh] w-fit justify-start rounded-xl 2xl:h-[15vh]"}>
        <Image
          src={category.image}
          alt={"thumbnail"}
          className="rounded-lg border-primary transition-all group-hover:border-4"
          width={150}
          height={230}
          objectFit={"contain"}
        />
      </div>
      <div className="absolute bottom-0 flex w-full flex-row space-x-3.5">
        <div className="flex w-full flex-col -space-y-1.5 text-left">
          <p className="... w-[75%] truncate font-noto-sans font-semibold transition-all group-hover:text-primary dark:text-white">
            {category.name}
          </p>
          <div className="... w-[75%] truncate font-noto-sans text-sm dark:text-gray-500">
            {category.developer?.split(",")[0] || ""}
          </div>
        </div>
      </div>
    </a>
  );
};

export default CategoryListItem;
