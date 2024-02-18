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
import { FaInbox } from "react-icons/fa6";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "@radix-ui/react-separator";

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
        <h1 className="group animate-shake">
          <Link
            href={"/"}
            className=" font-noto-sans font-bold text-black transition-all repeat-infinite group-hover:text-primary dark:text-white sm:text-xl"
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
              className="font-font w-fit rounded-lg bg-none px-4 py-2 font-noto-sans text-sm font-semibold text-white  dark:bg-primary dark:text-black hover:dark:bg-primary_lighter sm:text-base"
              onClick={() =>
                clerk.openSignUp({
                  appearance: {
                    elements: {
                      logoBox: "w-[48px]",
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
                        "bg-primary hover:bg-dark-primary-pink/80 text-sm normal-case",
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
              Sign Up
            </button>
          </>
        )}
        {user && (
          <div className="flex w-full flex-row items-center gap-x-5">
            <div>
              <Popover>
                <PopoverTrigger
                  asChild
                  className="tems-center flex justify-center rounded-md p-1 transition-colors hover:bg-[#eaeaea]/10 "
                >
                  <Button variant="link" className="px-2">
                    <FaInbox className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="absolute -right-40 mb-5 flex h-[20vh] w-[20vw] flex-col rounded-md border-none p-0 pt-3 dark:bg-[#141516] ">
                  <div className="title dark:bg-[#141516]e relative top-0 z-10 flex h-fit w-full flex-col border-b-[1px] border-b-zinc-700 pb-4 font-noto-sans">
                    <div className="text-center font-noto-sans text-lg font-semibold uppercase">
                      Notifications
                    </div>
                  </div>
                  <div>abc</div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="relative flex flex-row">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-[42px] w-[92px] rounded-full font-noto-sans dark:text-white"
                  >
                    <div className="flex h-16 max-h-16 w-fit flex-row items-center space-x-1 bg-[#fefefe] py-8 dark:bg-[#292a2d]">
                      <span className="font-noto-sans text-xl font-semibold text-white hover:text-primary hover:underline">
                        {user.username}
                      </span>
                      &nbsp;
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
