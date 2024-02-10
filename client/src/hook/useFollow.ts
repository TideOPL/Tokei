"use client"
import axios from "axios";
import { env } from "~/env.mjs"
import { useEffect, useState } from "react";

interface useFollowType {
  follow: (genToken: () => Promise<string | null>) => Promise<boolean>
  following?: boolean
  followers: string
  chatRoomFollowSince: string
}

const useFollow = (getToken: () => Promise<string | null>, username: string, chatRoom: string): useFollowType => {
  const [following, setFollowing] = useState<boolean>(false);
  const [followers, setFollowers] = useState<string>("");
  const [chatRoomFollowSince, setChatRoomFollowSince] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {

      const token = await getToken()
      const following = await axios.get(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/amIFollowing?channel=${username}`, { headers: { 'Authorization': `Bearer ${token}`}}).then((res) => {
        return res.status == 200
      }).catch((err) => {console.warn(err); return false})

      setFollowing(following);
    }

    const getFollowers = async () => {
      const { data } = await axios.get<string>(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/getFollowerCount?channel=${username}`)
      setFollowers(data)
    }

    const getFollowSince = async () => {
       const value = await axios.get(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/followCheck?channel=${chatRoom}&user=${username}`).then((res) => {
        if (res.status == 200) {
          return res.data.timestamp;
        }
        return ""
      }).catch((err) => {console.warn(err); return false})
      setChatRoomFollowSince(value);
    }

    getFollowers();
    getFollowSince();

  
    fetch();  
  }, [])


  const follow = async (genToken: () => string | null) => {
    const fetch = async () => {
      const token = await genToken()
      return await axios.post(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/follow?channel=${username}`, {}, { headers: { 'Authorization': `Bearer ${token}`}}).then((res) => {
        return res.status == 200
      }).catch(() => false)
    }


    const result = await fetch();
    setFollowing(!following)

    return result;
  }

  //@ts-ignore
  return { follow, following, followers, chatRoomFollowSince}
}

export default useFollow;