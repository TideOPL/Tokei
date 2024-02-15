"use client"
import axios from "axios";
import { env } from "~/env.mjs"

interface useModerateType {
  timeoutUser: (userToBeMuted: string, channelId: string, timestampEnd: string, reason: string) => Promise<boolean>
}

const useModerate = (getToken: () => Promise<string | null>,): useModerateType => {
  const timeoutUser = async (userToBeMuted: string, channelId: string, timestampEnd: string, reason: string) => {
    const token = await getToken()
    const status = await axios.post(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/moderate/timeoutUser`, { "user": userToBeMuted, "channel": channelId, "timestampEnd": timestampEnd, "reason": reason }, { headers: { 'Authorization': `Bearer ${token}`}}).then(() => true).catch(() => false);

    return status
  }

  return {timeoutUser}
}

export default useModerate;