import { Github, LucideInstagram, Twitter, Youtube } from "lucide-react";
import SocialLink from "../ui/social-link";
import { Channel } from "~/interface/Channel";
import {
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaTiktok,
  FaDiscord,
} from "react-icons/fa6";

interface Props {
  channel: Channel;
  followers: string;
}

const About = ({ channel, followers }: Props) => {
  return (
    <div className="flex w-full items-center justify-center pb-10">
      <div className="mt-12 flex h-fit w-[85%] flex-row justify-between rounded-lg bg-zinc-600/20 px-5 py-5 shadow-md">
        <div className="relative flex flex-col space-y-1 pt-3">
          <div className="font-noto-sans text-2xl font-bold text-white">
            About {channel.username}
          </div>
          <div className="font-noto-sans font-semibold text-white">
            {followers || 0} followers
          </div>
          <div className="font-noto-sans font-normal text-white">abc</div>
        </div>
        <div className="space-y-1.5">
          <SocialLink
            icon={
              <FaXTwitter className="mt-1" fill="inherit" strokeWidth={0} />
            }
            link={"https://X.com"}
            title="X"
          />
          <SocialLink
            icon={
              <FaInstagram className="mt-1" fill="inherit" stroke="inherit" />
            }
            link={"https://Instagram.com"}
            title="Instagram"
          />
          <SocialLink
            icon={
              <FaYoutube className="mt-1" fill="inherit" stroke="inherit" />
            }
            link={"https://youtube.com"}
            title="Youtube"
          />
          <SocialLink
            icon={<FaGithub className="mt-1" fill="inherit" stroke="inherit" />}
            link={"https://github.com"}
            title="Github"
          />
          <SocialLink
            icon={<FaTiktok className="mt-1" fill="inherit" stroke="inherit" />}
            link={"https://tiktok.com"}
            title="TikTok"
          />
          <SocialLink
            icon={
              <FaDiscord className="mt-1" fill="inherit" stroke="inherit" />
            }
            link={"https://discord.com"}
            title="Discord"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
