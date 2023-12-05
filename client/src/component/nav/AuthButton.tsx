import Link from "next/link";
import React from 'react';

interface Props {
    text: string;
    primary?: boolean;
    href: string;
}

const AuthButton = ({text, primary=false, href}: Props): JSX.Element => {

    return (
        <Link href={href} className={`w-fit px-4 py-2 font-noto-sans ${primary ? 'transition-all bg-dark-primary-pink hover:bg-dark-primary-pink/70 text-white' : 'transition-all bg-none hover:bg-[#1a1b1e]/40 text-slate-900 dark:text-white'} uppercase rounded-lg font-font font-semibold text-sm sm:text-base`}>
            {text}
        </Link>
    );
}

export default AuthButton;