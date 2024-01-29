import { useEffect, useState } from "react"
import {Channel} from "../../interface/Channel";
import axios from "axios";
import { env } from "~/env.mjs";

interface Props {
  username: string
  color: string
}

const UserPopUp = ({username, color}: Props) => {
  const [user, setUser] = useState<Channel | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get<Channel>(`http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/user/getChannel?channel=${username}`);
      setUser(data);
    }

    fetch();
  }, [])

  return (
    <div className="flex flex-row">
      <div>
        abc
      </div>
    </div>
  )
}

export default UserPopUp