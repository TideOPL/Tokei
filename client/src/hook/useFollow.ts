"use client"
import axios from "axios";
import { env } from "~/env.mjs"
import { useEffect, useState } from "react";

interface useChannelType {
  follow: (genToken: () => Promise<string | null>) => Promise<boolean>
  following?: boolean
  followers: string
}

const useFollow = (getToken: () => Promise<string | null>, username: string): useChannelType => {
  const [following, setFollowing] = useState<boolean>(false);
  const [followers, setFollowers] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {

      const token = await getToken()
      const following = await axios.get(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/amIFollowing?channel=${username}`, { headers: { 'Authorization': `Bearer ${token}`}}).then((res) => {
        return res.status == 200
      }).catch((err) => {console.log(err); return false})

      console.log(following)
      setFollowing(following);
    }

    const getFollowers = async () => {
      const { data } = await axios.get<string>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/getFollowerCount?channel=${username}`)
      setFollowers(data)
    }

    getFollowers();


  
    fetch();  
  }, [])


  const follow = async (genToken: () => string | null) => {
    const fetch = async () => {
      const token = await genToken()
      return await axios.post(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/follow/follow?channel=${username}`, {}, { headers: { 'Authorization': `Bearer ${token}`}}).then((res) => {
        return res.status == 200
      }).catch(() => false)
    }


    const result = await fetch();
    setFollowing(!following)

    return result;
  }

  //@ts-ignore
  return { follow, following, followers}
}

export default useFollow;