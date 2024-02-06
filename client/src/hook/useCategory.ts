import axios from "axios";
import { env } from "~/env.mjs"
import { useEffect, useState } from "react";
import { ICategory } from "~/interface/Category";

interface useChannelType {
  items: Array<ICategory>
}

const useCategory = (): useChannelType => {
  const [items, setItems] = useState<Array<ICategory>>([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get<Array<ICategory>>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/categories/getCategories?page=0`)
      setItems(data)
    }
  
    fetch();  
  }, [])

  return {items}
}

export default useCategory;