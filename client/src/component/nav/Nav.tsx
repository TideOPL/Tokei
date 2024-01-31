import { UserResource } from "@clerk/types";
import AuthButton from "./AuthButton";
import Link from "next/link";
import { UserButton, UserProfile } from "@clerk/nextjs";
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

interface Props {
  user: UserResource | null | undefined;
  signOut: () => unknown;
}

const Nav = ({ user, signOut }: Props): JSX.Element => {
  const router = useRouter();
  return (
    <div className="flex h-16 max-h-16 w-full flex-row items-center justify-between bg-[#fefefe] px-2 py-8 dark:bg-[#292a2d] sm:px-12">
      <div className="space-x-6 sm:space-x-12">
        <Link
          href={"/"}
          className="font-noto-sans font-bold text-black transition-all hover:text-primary dark:text-white sm:text-xl "
        >
          TOKEI
        </Link>
        <Link
          href={"/"}
          className="font-noto-sans text-sm font-semibold text-black transition-all hover:text-primary dark:text-white sm:text-lg "
        >
          Browse
        </Link>
      </div>
      <div className="space-x-5">
        {!user && (
          <>
            <AuthButton text="log in" href="/signin" />
            <AuthButton text="sign up" primary href="/signup" />
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
                    <div className="font-noto-sans font-bold text-primary transition-all hover:underline sm:text-xl">
                      {user.username} -
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
