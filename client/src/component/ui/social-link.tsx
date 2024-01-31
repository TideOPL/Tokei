import Link from "next/link";

interface Props {
  title: string;
  link: string;
  icon: JSX.Element;
}

const SocialLink = ({ title, link, icon }: Props) => {
  return (
    <Link
      target="_blank"
      href={link}
      className="group flex flex-row space-x-1.5 text-white "
    >
      <div className="fill-zinc-500 stroke-zinc-700 pt-0.5 transition-all group-hover:fill-white group-hover:stroke-zinc-500">
        {icon}
      </div>
      <div className="text-zinc-500 transition-all hover:underline  group-hover:text-primary_lighter">
        {title}
      </div>
    </Link>
  );
};

export default SocialLink;
