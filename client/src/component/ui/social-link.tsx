import Link from "next/link"

interface Props{ 
    title: string 
    link: string
    icon: JSX.Element
}

const SocialLink = ({ title, link, icon }: Props ) => {
    return ( 
        <Link target="_blank" href={link} className="text-white flex flex-row space-x-1.5 group">
            <div className="pt-0.25 fill-zinc-500 stroke-zinc-700 group-hover:stroke-zinc-500 group-hover:fill-white transition-all">
                {icon}
            </div>
            <div className="text-zinc-500 group-hover:text-primary_lighter transition-all">
                {title}
            </div>
            
        </Link>
    )
}

export default SocialLink;