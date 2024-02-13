import { UserResource } from "@clerk/types";
import AuthButton from "./AuthButton";
import Link from "next/link";
import { SignUpButton, UserButton, UserProfile, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/component/ui/dropdown-menu";
import { Button } from "~/component/ui/button";
import {
  User,
  CreditCard,
  Settings,
  Keyboard,
  Users,
  UserPlus,
  Mail,
  MessageSquare,
  PlusCircle,
  Plus,
  Github,
  LifeBuoy,
  Cloud,
  LogOut,
  Video,
  KanbanSquare,
} from "lucide-react";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { dark } from "@clerk/themes";

interface Props {
  user: UserResource | null | undefined;
  signOut: () => unknown;
}

const Nav = ({ user, signOut }: Props): JSX.Element => {
  const router = useRouter();
  const clerk = useClerk();
  return (
    <div className="flex h-16 max-h-16 w-full flex-row items-center justify-between bg-[#fefefe] px-2 py-8 dark:bg-[#292a2d] sm:px-12">
      <div className="flex flex-row space-x-6 sm:space-x-12">
        <h1 className="group">
          <Link
            href={"/"}
            className="font-noto-sans font-bold text-black transition-all group-hover:text-primary dark:text-white sm:text-xl"
          >
            TOKEI
          </Link>
        </h1>

        <h2 className="group">
          <Link
            href={"/"}
            className="font-noto-sans font-bold text-black transition-all group-hover:text-primary dark:text-white sm:text-xl"
          >
            Browse
          </Link>
        </h2>
      </div>
      <div className="space-x-5">
        {!user && (
          <>
            <button
              className="font-font w-fit rounded-lg bg-dark-primary-pink bg-none px-4 py-2 font-noto-sans text-sm font-semibold uppercase text-white hover:bg-[#1a1b1e]/40 hover:bg-dark-primary-pink/70 sm:text-base"
              onClick={() =>
                clerk.openSignUp({
                  appearance: {
                    elements: {
                      modalCloseButton: "text-white",
                      card: "dark bg-[#282c34] font-noto-sans",
                      headerTitle: "text-black dark:text-white",
                      headerSubtitle: "text-black dark:text-white",
                      socialButtonsBlockButton: "dark:border-white",
                      socialButtonsBlockButtonArrow: "dark:text-white",
                      socialButtonsBlockButtonText:
                        "text-black dark:text-white p-0.5",
                      dividerLine: "dark:bg-white",
                      dividerText: "text-black dark:text-white",
                      formFieldInput:
                        "dark:bg-[#393d45]/80 focus:outline-none dark:caret-white focus:border-2 focus:border-white dark:text-white",
                      formFieldLabel: "text-black dark:text-white",
                      formFieldSuccessText: "dark:text-white",
                      formFieldErrorText: "dark:text-white",
                      formFieldInputShowPasswordIcon: "dark:text-white",
                      formButtonPrimary:
                        "bg-dark-primary-pink hover:bg-dark-primary-pink/80 text-sm normal-case",
                      footerAction: "flex w-full items-center justify-center",
                      footerActionText: "text-black dark:text-white",
                      footerActionLink:
                        "text-secondary hover:text-secondary/80",
                      formFieldInfoText: "text-black dark:text-white",
                      identityPreview:
                        "text-black dark:text-white border-black dark:border-white",
                      identityPreviewText: "text-black dark:text-white",
                      formHeaderTitle: "text-black dark:text-white",
                      formHeaderSubtitle: "text-black dark:text-white",
                      otpCodeFieldInput:
                        "dark:border-white/20 dark:text-white ",
                      formResendCodeLink:
                        "text-primary_lighter dark:text-primary",
                      identityPreviewEditButton:
                        "text-primary_lighter dark:text-primary",
                    },
                  },
                })
              }
            >
              SIGN UP
            </button>
          </>
        )}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-[46px] w-[46px] rounded-full font-noto-sans dark:text-white"
              >
                <div className="flex h-16 max-h-16 w-full flex-row-reverse items-center justify-between bg-[#fefefe] px-2 py-8 dark:bg-[#292a2d] sm:px-12">
                  <div className=" absolute right-32 space-x-4 sm:space-x-12 ">
                    <div className="font-noto-sans font-bold text-white transition-all sm:text-xl">
                      <span className="hover:text-primary hover:underline">
                        {user.username}
                      </span>
                      &nbsp;-
                    </div>
                  </div>
                  <Avatar className=" min-h-[32px] min-w-[32px] md:min-h-[42px] md:min-w-[42px]">
                    <AvatarImage
                      src={user.profileImageUrl}
                      alt="profile"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user.username?.at(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* <Image src={user.profileImageUrl} height={42} width={42} alt="profile" className="rounded-full object-cover min-w-[32px] min-h-[32px] md:min-w-[42px] md:min-h-[42px]"/> */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => router.push("/" + user.username)}
                >
                  <Video className="mr-2 h-4 w-4" />
                  <span>Channel</span>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <KanbanSquare className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  window.open("https://github.com/TideOPL/Tokei", "_blank")
                }
              >
                <Github className="mr-2 h-4 w-4" />
                <span>GitHub</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span>API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Nav;
