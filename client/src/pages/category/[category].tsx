import Head from "next/head";
import Sidebar from "~/component/nav/Sidebar";
import Nav from "~/component/nav/Nav";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { env } from "~/env.mjs";
import { ICategory } from "~/interface/Category";
import { useEffect, useState } from "react";
import { Browse, Channel, ILiveFollowing, Stream } from "~/interface/Channel";
import { useAppDispatch } from "~/store/hooks";
import { addFollowingChannel } from "~/store/slice/followSlice";
import { Badge } from "~/component/ui/badge";
import { Separator } from "~/component/ui/separator";
import useCategory from "~/hook/useCategory";
import BrowseListItem from "~/component/browse/BrowseListItem";
import ImageWithFallback from "~/component/ui/fallback-image";
import React from "react";

export const getServerSideProps = (async (context) => {
  if (
    context.params?.category == undefined ||
    context.params?.category[0] == undefined
  ) {
    return {
      notFound: true,
    };
  }

  axios.defaults.url = `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}`;
  const category = context.params.category;

  const response = (await axios
    .get(
      `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/categories/getCategoryByName?category=${category.concat()}`,
    )
    .then((res) => res.data)
    .catch()) as ICategory[] | null | undefined;

  if (response == null && response == undefined) {
    return {
      notFound: true,
    };
  }

  if (response.length == 0) {
    return { notFound: true };
  }

  const categoryData = response[0];

  if (categoryData == undefined) {
    return { notFound: true };
  }

  return { props: { categoryData } };
}) satisfies GetServerSideProps<{ categoryData: ICategory }>;

const Category = ({
  categoryData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, getToken } = useAuth();
  const { browseItems } = useCategory(categoryData.searchName);
  const [title, setTitle] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTitle(` - ${categoryData.name}`);

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

      liveFollowing.map((following) =>
        dispatch(addFollowingChannel(following)),
      );
    };

    if (isSignedIn) {
      getFollowingList();
    }
  }, [isSignedIn]);

  return (
    <div className="max-h-screen-ios flex h-screen max-h-screen flex-col overflow-hidden scroll-smooth bg-light-primary-light dark:bg-[#141516]">
      <Head>
        <title>{"Tokei" + title}</title>
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
      </Head>
      {/**@ts-ignore**/}
      <Nav user={user} signOut={() => signOut()} />

      <div className="flex max-h-[calc(100%-64px)] flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex h-full max-h-full flex-grow pl-10 pt-10">
          <div className="w-full overflow-x-hidden">
            <div className="mb-10 flex h-52 w-full flex-row items-center space-x-5 px-2">
              <div className="flex h-full min-w-[144px] flex-initial">
                <ImageWithFallback
                  src={categoryData.image}
                  fallback="/placeholder-category.png"
                  alt={"thumbnail"}
                  className="h-full w-full rounded-lg object-contain"
                  width={144}
                  height={198}
                />
              </div>
              <div className="flex max-w-[50vw] flex-col gap-y-2">
                <div className="text-3xl font-semibold text-white">
                  {categoryData.name}
                </div>
                <div className="text-lg font-semibold text-white">
                  {categoryData.developer}
                </div>
                <div className="w-full truncate dark:text-white">
                  <span>
                    {categoryData.description.replaceAll("&quot;", '"')}
                  </span>
                </div>
                <div className="flex w-fit flex-row gap-x-2">
                  {categoryData.tags.map((tag) => (
                    <Badge
                      variant="secondary"
                      className="h-8 w-fit rounded-xl text-center"
                    >
                      <div className="w-full text-center text-lg font-semibold">
                        {tag}
                      </div>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="">
              <Separator
                orientation="horizontal"
                className="h-[2px] dark:bg-zinc-600"
              />
            </div>
            {browseItems.length <= 0 || browseItems[0]?.channel == null ? (
              <div className="w-full pt-10 text-center font-noto-sans dark:text-white">
                <div className="text-3xl font-semibold">Uh Oh!</div>
                <div className="text-xl font-semibold">
                  It look's like there's no broadcasts at the moment!
                </div>
              </div>
            ) : (
              <div className="grid h-full w-full justify-center pb-5 pt-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[1800px]:grid-cols-5 min-[2000px]:grid-cols-6">
                {browseItems.map((channel: Browse) => (
                  <BrowseListItem
                    key={channel.channel.username}
                    title={channel.stream.title || ""}
                    username={channel.channel.username}
                    pfp={channel.channel.pfp}
                    thumbnail={`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getThumbnail/${channel.channel.username}`}
                    tags={channel.stream.tags}
                    viewers={channel.stream.viewers}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
