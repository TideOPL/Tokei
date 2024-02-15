"use client"
import axios from "axios";
import { env } from "~/env.mjs"
import { ITimeout } from "~/interface/chat";

interface useModerateType {
  timeoutUser: (userToBeMuted: string, channelId: string, timestampEnd: string, reason: string) => Promise<boolean>
  amITimedOut: (channelId: string) => Promise<ITimeout>
}

const useModerate = (getToken: () => Promise<string | null>,): useModerateType => {
  const timeoutUser = async (userToBeMuted: string, channelId: string, timestampEnd: string, reason: string) => {
    const token = await getToken()
    const status = await axios.post(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/moderate/timeoutUser`, { "user": userToBeMuted, "channel": channelId, "timestampEnd": timestampEnd, "reason": reason }, { headers: { 'Authorization': `Bearer ${token}`}}).then(() => true).catch(() => false);

    return status
  }

  const amITimedOut = async (channel: string) => {
    const token = await getToken();
    const data  = await axios.get<ITimeout>(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/moderate/amITimedOut/?channel=${channel}`, { headers: {"Authorization": `Bearer ${token}`}}).then((res) => null).catch((err) => {return err.response.data});
    
    return data
  }

  return {timeoutUser, amITimedOut}
}

export default useModerate;