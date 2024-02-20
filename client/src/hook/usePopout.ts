"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { env } from "~/env.mjs"
import { Channel } from "~/interface/Channel";
import { useAppSelector } from "~/store/hooks";
import { addChannel } from "~/store/slice/userSlice";

interface usePopoutType {
  channel: Channel | null | undefined;
  isMod: boolean
  setIsMod: React.Dispatch<React.SetStateAction<boolean>>;
}

const usePopout = (getToken: () => Promise<string | null>, channelName: string): usePopoutType => {
  const [channel, setChannel] = useState<Channel | null>();
  const [isMod, setIsMod] = useState<boolean>(false);
  const channels = useAppSelector((state) => state.channels);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get<Channel>(
        `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/getChannel?channel=${channelName}`,
      );

      setChannel(data);
      dispatch(addChannel(data))
    }

    const fetchModStatus = async () => {
      const token = await getToken();
      const modStatus = await axios
      .get<boolean>(
        `${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/moderation/modCheck?channel=${channelName}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => res.status === 200)
      .catch(() => false);
      setIsMod(modStatus);
    }


    const channelCached: Channel[] = channels.channels.filter(
      (channel) => channel.username === channelName,
    );

    if (channelCached[0] != null) {
      setChannel(channelCached[0]);
      return;
    }

    fetch();
  }, [channelName])

  return {channel, isMod, setIsMod}
}

export default usePopout;