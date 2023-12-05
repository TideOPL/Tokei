import { UserResource } from "@clerk/types"
import AuthButton from "./AuthButton";
import Link from "next/link";
import { UserButton, UserProfile } from "@clerk/nextjs";

interface Props {
    user: UserResource | null | undefined
}

const Nav = ({user}: Props): JSX.Element => {
    return (
        <div className="sticky flex flex-row h-14 w-full py-8 px-2 sm:px-12 items-center justify-between bg-[#fefefe] dark:bg-[#212226] drop-shadow-xl">
            <div className="space-x-6 sm:space-x-12">
                <Link href={'/'} className="font-noto-sans font-bold dark:text-white sm:text-xl transition-all hover:text-primary text-black ">
                    TOKEI
                </Link>
                <Link href={'/'} className="font-noto-sans font-semibold dark:text-white text-sm sm:text-lg transition-all hover:text-primary text-black ">
                    Browse
                </Link>
            </div>
            <div className="space-x-5">
                {!user &&
                    <>
                        <AuthButton text="log in" href="/signin"/>
                        <AuthButton text="sign up" primary href="/signup"/>
                    </>
                }
                {user &&
                    <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                card: 'bg-[#fefefe] dark:bg-[#323337] font-noto-sans',
                                userPreviewMainIdentifier: 'dark:text-white font-bold',
                                userPreviewSecondaryIdentifier: 'dark:text-slate-300',

                                userButtonPopoverActionButton: 'group',
                                userButtonPopoverActionButtonIcon: 'text-white',
                                userButtonPopoverActionButtonText: 'transition-all group-hover:text-primary_lighter dark:text-white'
                            }
                        }}
                     />
                }
            </div>
        </div>
    )
}

export default Nav;