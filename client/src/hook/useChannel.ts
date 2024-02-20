"use client"
import axios from "axios";
import { Channel, Stream } from "~/interface/Channel";
import { env } from "~/env.mjs"
import { useEffect, useState } from "react";
import { useAppDispatch } from "~/store/hooks";
import { setStreamInfo } from "~/store/slice/streamInfoSlice";

interface useChannelType {
  channel: Channel
  stream: Stream | null
  follow: (genToken: () => Promise<string | null>) => Promise<boolean>
  following?: boolean
  followers: string
}

const useChannel = (getToken: () => Promise<string | null>, channel: Channel): useChannelType => {
  const [stream, setStream] = useState<Stream | null>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const [followers, setFollowers] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get<Stream>(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getStream?channelID=${channel.clerk_id}`)
      setStream(data)


      if (data) {
        dispatch(
          setStreamInfo({
            title: data.title || "",
            category: data.category || "",
            tags: data.tags,
          }));
      }

      const token = await getToken()
      const following = await axios.get(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/amIFollowing?channel=${channel.username}`, { headers: { 'Authorization': `Bearer ${token}`}}).then((res) => {
        return res.status == 200
      }).catch((err) => {console.warn(err); return false})

      setFollowing(following);
    }

    const getFollowers = async () => {
      const { data } = await axios.get<string>(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/getFollowerCount?channel=${channel.username}`)
      setFollowers(data)
    }

    getFollowers();


  
    fetch();  
  }, [channel])


  const follow = async (genToken: () => string | null) => {
    const fetch = async () => {
      const token = await genToken()
      return await axios.post(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/follow?channel=${channel.username}`, {}, { headers: { 'Authorization': `Bearer ${token}`}}).then((res) => {
        return res.status == 200
      }).catch(() => false)
    }


    const result = await fetch();
    setFollowing(!following)

    return result;
  }


  //@ts-ignore
  return {channel, stream, follow, following, followers}
}

export default useChannel;