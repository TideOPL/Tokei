import { Channel, ILiveFollowing, Stream } from "~/interface/Channel";
import { useAppSelector } from "~/store/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { env } from "~/env.mjs";
import { useDispatch } from "react-redux";
import {
  addFollowingChannel,
  resetFollowingChannel,
} from "~/store/slice/followSlice";

interface UserProps {
  followingUser: ILiveFollowing;
}

const Sidebar = (): JSX.Element => {
  const { getToken, isSignedIn } = useAuth();
  const followingList = useAppSelector((state) => state.following);
  const dispatch = useDispatch();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const getFollowingList = async () => {
      const token = await getToken();
      const { data } = await axios.get<Channel[]>(
        `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/getFollowingList`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const liveFollowing: ILiveFollowing[] = [];

      for (let j = 0; j < data.length; j++) {
        const channel = data[j];

        if (!channel) {
          continue;
        }

        if (channel.isLive) {
          const { data } = await axios.get<Stream>(
            `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getStream?channelID=${channel.clerk_id}`,
          );
          liveFollowing.push({
            following: channel,
            stream: data,
          });
          continue;
        }

        liveFollowing.push({
          following: channel,
        });
      }

      dispatch(resetFollowingChannel());
      liveFollowing.map((following) => {
        dispatch(addFollowingChannel(following));
      });
    };

    if (isSignedIn) {
      getFollowingList();
    }
  }, [isSignedIn]);

  followingList.following.map((following) => console.log(following));

  return (
    <div className="dark:bg-back-secondary sticky min-h-full min-w-[223px] flex-col space-y-5 border-r border-zinc-500 bg-[#fefefe] px-2 py-8 font-noto-sans text-white">
      <div className="text-sm font-semibold uppercase">Following</div>
      <div className="flex flex-col gap-y-4">
        {followingList.following.map((following) => (
          <User key={following.following.clerk_id} followingUser={following} />
        ))}
      </div>
    </div>
  );
};

const User = ({ followingUser }: UserProps) => {
  const { following, stream } = followingUser;
  return (
    <Link
      href={`/${following.username}`}
      className="group flex flex-row space-x-2 rounded-lg p-1 transition-colors hover:bg-zinc-700/20"
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
          <div className="... truncate text-[13px] font-normal text-zinc-500">
            {stream.category.name}
          </div>
        ) : (
          <></>
        )}
      </div>
      {following.isLive && stream != null ? (
        <div className="flex w-full flex-row items-center justify-end space-x-1 px-2">
          <div className="h-[10px] w-[10px] rounded-full border-[5px] border-primary" />
          <div className="text-sm">{stream.viewers}</div>
        </div>
      ) : (
        <></>
      )}
    </Link>
  );
};

export default Sidebar;

const SmallSize = () => {};
