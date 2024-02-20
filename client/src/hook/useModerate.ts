"use client"
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs"
import { Channel } from "~/interface/Channel";
import { ITimeout } from "~/interface/chat";

interface useModerateType {
  timeoutUser: (userToBeMuted: string, channelId: string, timestampEnd: string, reason: string) => Promise<boolean>
  unTimeoutUser: (user: string) => Promise<boolean>
  amITimedOut: (channelId: string) => Promise<ITimeout>
  checkTimeout: (userId: string) => Promise<ITimeout>
  amIMod: boolean
}

const useModerate = (getToken: () => Promise<string | null>, channel: Channel): useModerateType => {
  const {user} = useUser();
  const [amIMod, setAmIMod] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      if (user?.username == channel.username) {
        setAmIMod(true);
        return;
      }
      
      const token = await getToken();
      const modStatus = await axios
      .get<boolean>(
        `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/moderation/amIMod?channel=${channel.username}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => res.status === 200)
      .catch(() => false);
  
      setAmIMod(modStatus);
    }

    fetch();
  }, [channel])

  const timeoutUser = async (userToBeMuted: string, channelId: string, timestampEnd: string, reason: string) => {
    if (!amIMod) {return false}

    const token = await getToken()
    const status = await axios.post(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/moderate/timeoutUser`, { "user": userToBeMuted, "channel": channelId, "timestampEnd": timestampEnd, "reason": reason }, { headers: { 'Authorization': `Bearer ${token}`}}).then(() => true).catch(() => false);

    return status
  }

  const unTimeoutUser = async (userId: string) => {
    if (!amIMod) {return false}

    const token = await getToken();
    const status = await axios.post(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/moderate/unTimeoutUser`, { "user": userId, "channel": channel.clerk_id }, { headers: { 'Authorization': `Bearer ${token}`}}).then(() => true).catch(() => false);

    return status;
  }

  const amITimedOut = async (channel: string) => {
    const token = await getToken();
    const data  = await axios.get<ITimeout>(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/moderate/amITimedOut/?channel=${channel}`, { headers: {"Authorization": `Bearer ${token}`}}).then((res) => null).catch((err) => {return err.response.data});
    
    return data
  }

  const checkTimeout = async (userId: string) => {
    if (userId == "") {
      return;
    }

    const token = await getToken();
    const data  = await axios.get<ITimeout>(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/moderate/checkTimeout/?channel=${channel.clerk_id}&user=${userId}`, { headers: {"Authorization": `Bearer ${token}`}}).then((res) => null).catch((err) => {return err.response.data});
    
    return data
  }

  return {timeoutUser, unTimeoutUser, amITimedOut, checkTimeout, amIMod}
}

export default useModerate;