import React from "react";
import SocialLink from "../ui/social-link";
import { FaXTwitter } from "react-icons/fa6";
import Socials from "./Socials";

const Footer = (): JSX.Element => {
  return (
    <div className="bottom-0 flex flex-col items-center justify-items-end">
      <div>ABC</div>
      <div>
        <div className="space-y-1.5">
          <Socials
            icon={
              <FaXTwitter
                className="mt-1 text-3xl"
                fill="inherit"
                strokeWidth={0}
              />
            }
            link={"https://X.com"}
            title="X"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
