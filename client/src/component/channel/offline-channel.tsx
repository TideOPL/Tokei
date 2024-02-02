import { getRelativeTime } from "~/lib/utils";
import About from "./about";
import ChannelLink from "./channel-links";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Channel, Stream } from "~/interface/Channel";
import FollowContainer from "./follow-container";

interface Props {
  signedIn: boolean | undefined;
  userId: string;
  channel: Channel;
  stream: Stream | null;
  followers: string;
  following: boolean | undefined;
  follow: (getToken: () => Promise<string | null>) => void;
  getToken: () => Promise<string | null>;
}

const OfflineChannel = ({
  signedIn,
  userId,
  channel,
  stream,
  followers,
  follow,
  getToken,
  following,
}: Props) => {
  return (
    <div className="flex h-[60vh] min-h-fit w-full max-w-[100%] flex-col">
      <div className="mb-4 flex h-full min-h-[52rem] w-full flex-col justify-center bg-[#212224]/75 dark:bg-zinc-800/50">
        <div className="pb-2 text-center text-4xl font-extrabold text-white md:text-8xl">
          {channel.username}
        </div>
        <div className="text-center text-2xl font-bold text-white md:text-4xl">
          Is currently offline
        </div>
        <div className="text-center text-2xl font-semibold text-white md:text-xl">
          they were last live{" "}
          {getRelativeTime(parseInt(stream?.timestamp || "0"))}
        </div>
      </div>
      <div className="flex flex-row space-x-3 px-5 py-2">
        <div className="relative h-fit w-fit self-center rounded-full border-2 border-none">
          <Avatar className="min-h-[52px] min-w-[52px] md:min-h-[64px] md:min-w-[64px]">
            <AvatarImage
              src={channel.pfp}
              alt="profile"
              className="object-cover"
            />
            <AvatarFallback>
              {channel.username.at(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-col">
            <button className="channel flex flex-row space-x-2 font-semibold transition-all dark:text-white">
              <div className="self-center text-xl font-bold">
                {channel.username}
              </div>
            </button>
            <div className="title font-semibold dark:text-white">
              {stream?.streamTitle}
            </div>
            <div className="flex flex-row">
              <div className="category font-semibold text-primary_lighter dark:text-primary">
                {stream?.category}
              </div>
              <div className="space-x-2 pl-2">
                {stream?.tags.map((tag: string) => (
                  <Badge variant="secondary" className="w-fit rounded-xl">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-x-2">
            {signedIn && userId != channel.clerk_id ? (
              <FollowContainer
                follow={() => follow}
                getToken={() => getToken()}
                following={following}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <About channel={channel} followers={followers} />
      <ChannelLink />
    </div>
  );
};

export default OfflineChannel;
