import axios from "axios";
import { Browse, Channel, Stream } from "~/interface/Channel";
import { env } from "~/env.mjs"
import { useEffect, useState } from "react";
import { ICategory } from "~/interface/Category";

interface useChannelType {
  browseItems: Array<Browse>
  categoryItems: Array<ICategory>
  showMoreCategory: () => void
}

const useBrowse = (): useChannelType => {
  const [browseItems, setBrowseItems] = useState<Array<Browse>>([])
  const [categoryItems, setCategoryItems] = useState<Array<ICategory>>([])
  const [count, setCount] = useState(0);


  useEffect(() => {
    const fetchBrowse = async () => {
      const { data } = await axios.get<Array<Browse>>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/getAllStreams`)
      setBrowseItems(data)
    }
    const fetchCategories = async () => {
      const { data } = await axios.get<Array<ICategory>>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/categories/getCategories?page=0`)
      setCategoryItems(data)
    }
  
    fetchCategories();
    fetchBrowse();  
    setCount(count + 1);
  }, [])

  const showMoreCategory = async () => {
    const { data } = await axios.get<Array<ICategory>>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/categories/getCategories?page=${count}`)
    setCategoryItems(category => [...category, ...data])
    setCount(count + 1);
  }

  return {browseItems, categoryItems, showMoreCategory}
}

export default useBrowse;