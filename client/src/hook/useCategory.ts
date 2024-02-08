import axios from "axios";
import { env } from "~/env.mjs"
import { useEffect, useState } from "react";
import { Browse } from "~/interface/Channel";

interface useChannelType {
  browseItems: Array<Browse>
}

const useCategory = (category: string): useChannelType => {
  const [browseItems, setBrowseItems] = useState<Array<Browse>>([])


  useEffect(() => {
    const fetchBrowse = async () => {
      const { data } = await axios.get<Array<Browse>>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getAllStreamsByCategory?category=${category}`)
      setBrowseItems(data)
    }
  
    fetchBrowse();  
  }, [])

  return {browseItems}
}

export default useCategory;