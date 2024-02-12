import React from "react";
import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import Socials from "./Socials";
import Link from "next/link";

const Footer = (): JSX.Element => {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-items-end px-3 py-16">
      <div className="font-noto-sans text-3xl font-bold text-white">TOKEI</div>
      <div className="pt-4 text-center font-noto-sans text-sm font-semibold text-white">
        Our Policy
        <div className="flex flex-row gap-x-2 pt-2 font-noto-sans text-sm text-gray-500">
          <span>
            <FooterLink title={"Community Guidelines"} href={"/"} />
          </span>
          |
          <span>
            <FooterLink title={"Terms of Service"} href={"/"} />
          </span>
          |
          <span>
            <FooterLink title={"Privacy Policy"} href={"/"} />
          </span>
          |
          <span>
            <FooterLink title={"DMCA Policy"} href={"/"} />
          </span>
          |
          <span>
            <FooterLink title={"Help & Support"} href={"/"} />
          </span>
        </div>
      </div>
      <div className="pt-4 text-center font-noto-sans text-sm font-semibold text-white">
        Contact Us
        <div className="flex flex-row gap-x-2 pt-2 font-noto-sans text-sm text-gray-500">
          <span>
            <FooterLink title={"Support"} href={"mailto:support@tokei.live"} />
          </span>
          |
          <span>
            <FooterLink
              title={"Partners"}
              href={"mailto:partners@tokei.live"}
            />
          </span>
        </div>
      </div>
      <div>
        <div className=" flex flex-row space-x-7 pt-12 text-2xl">
          <Socials
            icon={
              <FaXTwitter className="mt-1" fill="inherit" strokeWidth={0} />
            }
            link={"https://X.com/@TokeiLive"}
          />
          <Socials
            icon={<FaTiktok className="mt-1" fill="inherit" stroke="inherit" />}
            link={"https://tiktok.com"}
          />
          <Socials
            icon={
              <FaDiscord className="mt-1" fill="inherit" stroke="inherit" />
            }
            link={"https://discord.com"}
          />
          <Socials
            icon={
              <FaInstagram className="mt-1" fill="inherit" stroke="inherit" />
            }
            link={"https://Instagram.com"}
          />
          <Socials
            icon={<FaGithub className="mt-1" fill="inherit" stroke="inherit" />}
            link={"https://github.com"}
          />
        </div>
      </div>
    </div>
  );
};

interface FooterLinkProp {
  title: string;
  href: string;
}

const FooterLink = ({ title, href }: FooterLinkProp) => {
  return (
    <Link href={href} aria-label={title} className="group">
      <div className="text-gray-500 transition-colors group-hover:text-white">
        {title}
      </div>
    </Link>
  );
};

export default Footer;
