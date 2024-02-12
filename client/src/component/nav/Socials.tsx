import Link from "next/link";

interface Props {
  link: string;
  icon: JSX.Element;
}

const Socials = ({ link, icon }: Props) => {
  return (
    <Link
      target="_blank"
      href={link}
      className="group flex flex-row space-x-1.5 text-white "
    >
      <div className="fill-zinc-400 stroke-zinc-700 pt-0.5 transition-all group-hover:fill-primary group-hover:stroke-primary">
        {icon}
      </div>
    </Link>
  );
};

export default Socials;
