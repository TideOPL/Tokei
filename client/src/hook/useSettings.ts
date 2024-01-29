"use client"
import axios from "axios";
import { env } from "~/env.mjs"

interface useSettingsType {
  showKey: () => Promise<string>
  resetKey: () => Promise<boolean>
  copyKey: () => Promise<boolean>
}

const useSettings = (getToken: () => Promise<string | null>, id: string): useSettingsType => {
  const showKey = async () => {
    const token = await getToken()
    const { data } = await axios.get<string>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/settings/getKey`, { headers: { 'Authorization': `Bearer ${token}`}})

    return data
  }

  const resetKey = async () => {
    const token = await getToken()
    const status = await axios.get(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/settings/resetKey`, { headers: { 'Authorization': `Bearer ${token}`}}).then(() => true).catch(() => false);
    return status
  }

  const copyKey = async () => {
    const token = await getToken()
    const { data } = await axios.get<string>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/settings/getKey`, { headers: { 'Authorization': `Bearer ${token}`}})

    try {
      navigator.clipboard.writeText(data);
    } catch {
      return false
    }
    return true
  }

  return {showKey, resetKey, copyKey}
}

export default useSettings;