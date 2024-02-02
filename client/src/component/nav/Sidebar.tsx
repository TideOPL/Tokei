import { ILiveFollowing } from "~/interface/Channel";
import { useAppSelector } from "~/store/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

interface UserProps {
  followingUser: ILiveFollowing;
}

const Sidebar = (): JSX.Element => {
  const followingList = useAppSelector((state) => state.following);

  return (
    <div className="sticky min-h-full w-[16%] flex-col space-y-5 border-r border-zinc-500 bg-[#fefefe] px-2 py-8 font-noto-sans text-white dark:bg-[#1f2023]">
      <div className="text-sm font-semibold uppercase">Followed Channels</div>
      {followingList.following.map((following) => (
        <User followingUser={following} />
      ))}
    </div>
  );
};

const User = ({ followingUser }: UserProps) => {
  const { following, stream } = followingUser;

  return (
    <Link
      href={`/${following.username}`}
      className="group flex flex-row space-x-2 rounded-lg px-0.5 py-0.5 transition-colors hover:bg-zinc-700/20"
    >
      <div
        className={`relative h-fit w-fit self-center rounded-full ${following.isLive && "border-2 border-primary"}`}
      >
        <Avatar className="min-h-[20px] min-w-[20px] md:min-h-[32px] md:min-w-[32px]">
          <AvatarImage
            src={following.pfp}
            alt="profile"
            className={`object-cover ${!following.isLive && "grayscale"}`}
          />
          <AvatarFallback>
            {following.username.at(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-sm font-semibold">{following.username}</div>
        {following.isLive && stream != null ? (
          <div className="text-[13px] font-normal text-zinc-500">
            {stream.category}
          </div>
        ) : (
          <></>
        )}
      </div>
      {following.isLive && stream != null ? (
        <div className="flex flex-row items-center space-x-1 pl-2">
          <div className="h-[10px] w-[10px] rounded-full border-[5px] border-primary" />
          <div className="text-sm">1.2k</div>
        </div>
      ) : (
        <></>
      )}
    </Link>
  );
};

export default Sidebar;
