import axios from "axios";
import { Browse, Channel, Stream } from "~/interface/Channel";
import { env } from "~/env.mjs"
import { useEffect, useState } from "react";

interface useChannelType {
  items: Array<Browse>
}

const useBrowse = (): useChannelType => {
  const [items, setItems] = useState<Array<Browse>>([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get<Array<Browse>>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getAllStreams`)
      setItems(data)
    }
  
    fetch();  
  }, [])

  return {items}
}

export default useBrowse;