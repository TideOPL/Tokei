import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { env } from "~/env.mjs";
import { Channel } from "~/interface/Channel";
import Message from "./message";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Cog,
  LucideUserRoundCog,
  Settings,
} from "lucide-react";
import ChatIdentity from "./chat-identity";
import ChatEmotes from "./chat-emotes";

import { UserResource } from "@clerk/types";

interface Props {
  channel: Channel;
  setViewers: React.Dispatch<React.SetStateAction<number>>;
  getToken: () => Promise<string | null>;
}

interface FormProps {
  user: UserResource;
  color: string;
  getToken: () => Promise<string | null>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket;
}

const Chat = ({ setViewers, channel, getToken }: Props) => {
  const divRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    Array<{ username: string; color: string; message: string }> | Array<any>
  >([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [visible, setVisible] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [color, setColor] = useState("#FFFFFF");

  let count = 0;

  useEffect(() => {
    // Create a socket connection
    const socket = io(
      `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}`,
    );
    setSocket(socket);

    // Listen for incoming messages
    socket.on(`message_${channel.username}`, (message) => {
      if (count >= 100) {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.slice(1);
          return [...updatedMessages, message];
        });
        return;
      }

      setMessages((prevMessages) => [...prevMessages, message]);
      count++;
    });

    socket.on(`viewers_${channel.username}`, (viewers: string[]) => {
      setViewers(viewers.length);
    });

    if (user) {
      socket.emit("join", { chat: channel.username, username: user?.username });
    }

    // Clean up the socket connection on unmount
    return () => {
      socket.emit("leave", {
        chat: channel.username,
        username: user?.username,
      });
      socket.disconnect();
    };
  }, [isSignedIn]);

  useEffect(() => {
    if (divRef.current != null) {
      divRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [messages]);

  if (socket == null) {
    return <div></div>;
  }

  return (
    <>
      <div
        className={`relative flex max-h-[calc(100vh-64px)] flex-col justify-between border-l border-zinc-500 bg-[#fefefe]  font-noto-sans text-white  dark:bg-[#141516] ${visible ? "w-[18%]" : "w-[0%]"} overflow-hidden transition-all duration-300 delay-150`}
      >
        <div className="relative flex h-full max-h-[80px] flex-initial items-center justify-between overflow-hidden border-b-2 border-b-zinc-700 shadow-md">
          <div className="w-full">
            <Button
              variant={"link"}
              className="justify-start text-start hover:bg-none hover:text-zinc-900 dark:hover:bg-none dark:hover:text-zinc-50"
              onClick={() => setVisible(!visible)}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
          <div className="title text-center font-noto-sans font-bold">CHAT</div>
          <div className="w-full" />
        </div>
        <div className="relative h-full max-h-[calc(85%-80px)] overflow-y-hidden">
          <div className="h-full overflow-x-hidden overflow-y-scroll px-2">
            {messages != null &&
              messages.map((message) => (
                <div ref={divRef}>
                  <Message
                    chatRoom={channel}
                    username={message.username}
                    color={message.color}
                    message={message.message}
                    icons={message.icons}
                  />
                </div>
              ))}
          </div>
        </div>

        {isSignedIn != null && user != null && socket != null ? (
          <div className="mx-0 flex h-40 flex-initial flex-col px-2 pt-3 dark:bg-[#1f2023]">
            <Form
              //@ts-ignore
              user={user}
              color={color}
              getToken={getToken}
              setColor={setColor}
              socket={socket}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div
        className={`${!visible ? "w-[2.5%]" : "w-[0%] max-w-[0vw]"} overflow-hidden transition-all duration-300 delay-150`}
      >
        <Button
          variant={"link"}
          className={`h-24 max-h-24 w-full justify-start text-start hover:bg-none hover:text-zinc-900 dark:hover:bg-none dark:hover:text-zinc-50 ${!visible ? "w-[100%]" : "w-[0%]"} overflow-hidden transition-all duration-300 delay-150`}
          onClick={() => setVisible(!visible)}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      </div>
    </>
  );
};

const Form = ({ user, color, getToken, setColor, socket }: FormProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const submit = (
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (message.length > 0) {
      socket.emit("message", {
        username: user?.username,
        color: color,
        message: message,
      });
      setMessage("");
    }
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={(evt) => {
        evt.preventDefault();
        submit(currentMessage, setCurrentMessage);
      }}
    >
      <div className="relative">
        <Input
          type={"text"}
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(value) => setCurrentMessage(value.currentTarget.value)}
          onSubmit={(evt) => {
            submit(currentMessage, setCurrentMessage);
          }}
          className="h-12 max-w-lg select-text break-all rounded-none border-none pl-10 focus:bg-none dark:bg-[#eaeaea]/5"
        />
        <div className="absolute left-2 top-3">
          <ChatIdentity
            user={user}
            initialColor={color}
            getToken={getToken}
            setColor={setColor}
          />
        </div>
        <div className="absolute right-5 top-3">
          <ChatEmotes />
        </div>
      </div>
      <div className="my-2 flex self-end">
        <Button
          className="relative h-[36px] w-[66.05px] items-center justify-center"
          variant={"link"}
          onClick={() => {}}
        >
          <Settings className="h-full w-full" />
        </Button>
        <Button
          type="submit"
          className="font-semibold dark:bg-primary dark:text-black hover:dark:bg-primary_lighter"
          onClick={() => {
            submit(currentMessage, setCurrentMessage);
          }}
        >
          Send
        </Button>
      </div>
    </form>
  );
};

export default Chat;
