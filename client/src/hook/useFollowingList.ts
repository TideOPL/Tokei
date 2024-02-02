"use client"
import axios from "axios";
import { env } from "~/env.mjs"
import { useEffect, useState } from "react";
import { Channel, ILiveFollowing, Stream } from "~/interface/Channel";

interface useFollowingListType {
  followingList: ILiveFollowing[]
}

const useFollowingList = (getToken: () => Promise<string | null>, dispatch: any): useFollowingListType => {
  const [followingList, setFollowingList] = useState<ILiveFollowing[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const token = await getToken()
      const { data } = await axios.get<Channel[]>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/getFollowingList`, { headers: { 'Authorization': `Bearer ${token}`}})
      const liveFollowing: ILiveFollowing[] = []

      data.map(async (channel) => {
        if (channel.isLive) {
            const { data } = await axios.get<Stream>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getStream?channelID=${channel.clerk_id}`)
            liveFollowing.push({
              following: channel,
              stream: data
            })
        }
        liveFollowing.push({
          following: channel,
        })
      });

      setFollowingList(liveFollowing);
      //@ts-ignore
      liveFollowing.map((following) => dispatch(addChannel(following)));
    }
  
    fetch();  
  }, [])

  return { followingList }
}

export default useFollowingList;