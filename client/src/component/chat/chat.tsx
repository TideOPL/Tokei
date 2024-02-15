import { useClerk, useUser } from "@clerk/nextjs";
import React, { useState, useEffect, useRef } from "react";
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

import { LoadedClerk, UserResource } from "@clerk/types";
import { useRouter } from "next/router";
import { ITimeout } from "~/interface/chat";
import useModerate from "~/hook/useModerate";

interface Props {
  channel: Channel;
  setViewers: React.Dispatch<React.SetStateAction<string>>;
  setDisableHotkey: React.Dispatch<React.SetStateAction<boolean>>;
  getToken: () => Promise<string | null>;
}

interface FormProps {
  timeOut: ITimeout | null;
  user: UserResource | null;
  color: string;
  getToken: () => Promise<string | null>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setDisableHotkey: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
}

const Chat = ({ setViewers, channel, getToken, setDisableHotkey }: Props) => {
  const divRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    Array<{ username: string; color: string; message: string }> | Array<any>
  >([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [visible, setVisible] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [timeOut, setTimeOut] = useState<ITimeout | null>(null);
  const router = useRouter();
  const { amITimedOut } = useModerate(getToken);

  let count = 0;

  useEffect(() => {
    // Create a socket connection
    const socket = io(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}`);
    setSocket(socket);

    const fetch = async () => {
      const data = await amITimedOut(channel.clerk_id);
      if (!data) {
        return;
      }
      if (data.timestamp_mutedEnd > Date.now()) {
        setTimeOut(data);
      }
    };

    fetch();

    socket.on(`stream_${channel.username}`, (status) => {
      setTimeout(() => router.reload(), 5000);
    });

    socket.on(`chat_${channel.username}`, (message: string) => {
      console.log(message);
      if (message.includes(`@ban-${user?.username}`)) {
        const regexPattern = /@ban-(.*?)-reason-(.*?)-end-(.*?)-moderator-(.*)/;

        // Match the string against the regular expression
        const matchResult = message.match(regexPattern);

        // Extract the captured groups
        if (matchResult && matchResult.length >= 4) {
          const reason = matchResult[2];
          const timestampEnd = matchResult[3];
          const moderator = matchResult[4];

          setTimeOut({
            reason: reason || "",
            timestamp_mutedEnd: parseInt(timestampEnd || "0"),
            moderator: moderator || "",
          });
        }
      }
    });

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

    socket.on(`viewers_${channel.username}`, (viewers: string) => {
      setViewers(viewers);
    });

    socket.emit("join", { chat: channel.username });

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

        <div className="mx-0 flex h-40 flex-initial flex-col px-2 pt-3 dark:bg-[#1f2023]">
          <Form
            //@ts-ignore
            user={user}
            color={color}
            getToken={getToken}
            setColor={setColor}
            socket={socket}
            setDisableHotkey={setDisableHotkey}
            timeOut={timeOut}
          />
        </div>
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

const Form = ({
  user,
  color,
  getToken,
  setColor,
  socket,
  setDisableHotkey,
  timeOut,
}: FormProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [error, setError] = useState(false);
  const clerk = useClerk();

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
        if (user != null) {
          if (currentMessage.length > 500) {
            console.log("hello");
            setError(true);
            setTimeout(() => setError(false), 1000);
            return;
          }
          submit(currentMessage, setCurrentMessage);
          return;
        }
        clerk.openSignUp({
          appearance: {
            elements: {
              modalCloseButton: "text-white",
              card: "dark bg-[#282c34] font-noto-sans",
              headerTitle: "text-black dark:text-white",
              headerSubtitle: "text-black dark:text-white",
              socialButtonsBlockButton: "dark:border-white",
              socialButtonsBlockButtonArrow: "dark:text-white",
              socialButtonsBlockButtonText: "text-black dark:text-white p-0.5",
              dividerLine: "dark:bg-white",
              dividerText: "text-black dark:text-white",
              formFieldInput:
                "dark:bg-[#393d45]/80 focus:outline-none dark:caret-white focus:border-2 focus:border-white dark:text-white",
              formFieldLabel: "text-black dark:text-white",
              formFieldSuccessText: "dark:text-white",
              formFieldErrorText: "dark:text-white",
              formFieldInputShowPasswordIcon: "dark:text-white",
              formButtonPrimary:
                "bg-dark-primary-pink hover:bg-dark-primary-pink/80 text-sm normal-case",
              footerAction: "flex w-full items-center justify-center",
              footerActionText: "text-black dark:text-white",
              footerActionLink: "text-secondary hover:text-secondary/80",
              formFieldInfoText: "text-black dark:text-white",
              identityPreview:
                "text-black dark:text-white border-black dark:border-white",
              identityPreviewText: "text-black dark:text-white",
              formHeaderTitle: "text-black dark:text-white",
              formHeaderSubtitle: "text-black dark:text-white",
              otpCodeFieldInput: "dark:border-white/20 dark:text-white ",
              formResendCodeLink: "text-primary_lighter dark:text-primary",
              identityPreviewEditButton:
                "text-primary_lighter dark:text-primary",
            },
          },
        });
      }}
    >
      <div className={`relative ${error && "animate-shake"}`}>
        <Input
          disabled={timeOut != null}
          onFocus={() => setDisableHotkey(true)}
          onBlur={() => setDisableHotkey(false)}
          type={"text"}
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(value) => setCurrentMessage(value.currentTarget.value)}
          onSubmit={(evt) => {
            if (user != null) {
              if (currentMessage.length > 500) {
                return;
              }
              console.log(currentMessage.length);
              submit(currentMessage, setCurrentMessage);
              return;
            }
            clerk.openSignUp({
              appearance: {
                elements: {
                  modalCloseButton: "text-white",
                  card: "dark bg-[#282c34] font-noto-sans",
                  headerTitle: "text-black dark:text-white",
                  headerSubtitle: "text-black dark:text-white",
                  socialButtonsBlockButton: "dark:border-white",
                  socialButtonsBlockButtonArrow: "dark:text-white",
                  socialButtonsBlockButtonText:
                    "text-black dark:text-white p-0.5",
                  dividerLine: "dark:bg-white",
                  dividerText: "text-black dark:text-white",
                  formFieldInput:
                    "dark:bg-[#393d45]/80 focus:outline-none dark:caret-white focus:border-2 focus:border-white dark:text-white",
                  formFieldLabel: "text-black dark:text-white",
                  formFieldSuccessText: "dark:text-white",
                  formFieldErrorText: "dark:text-white",
                  formFieldInputShowPasswordIcon: "dark:text-white",
                  formButtonPrimary:
                    "bg-dark-primary-pink hover:bg-dark-primary-pink/80 text-sm normal-case",
                  footerAction: "flex w-full items-center justify-center",
                  footerActionText: "text-black dark:text-white",
                  footerActionLink: "text-secondary hover:text-secondary/80",
                  formFieldInfoText: "text-black dark:text-white",
                  identityPreview:
                    "text-black dark:text-white border-black dark:border-white",
                  identityPreviewText: "text-black dark:text-white",
                  formHeaderTitle: "text-black dark:text-white",
                  formHeaderSubtitle: "text-black dark:text-white",
                  otpCodeFieldInput: "dark:border-white/20 dark:text-white ",
                  formResendCodeLink: "text-primary_lighter dark:text-primary",
                  identityPreviewEditButton:
                    "text-primary_lighter dark:text-primary",
                },
              },
            });
          }}
          className={`h-12 max-w-lg select-text break-all rounded-none border-none pl-10 pr-12 focus:bg-none dark:bg-[#eaeaea]/5`}
        />
        {user && (
          <div className="absolute left-2 top-3">
            <ChatIdentity
              user={user}
              initialColor={color}
              getToken={getToken}
              setColor={setColor}
            />
          </div>
        )}

        <div className="absolute right-5 top-3">
          <ChatEmotes
            setDisableHotkey={setDisableHotkey}
            setMessage={setCurrentMessage}
          />
        </div>
        <div
          className={`absolute -bottom-8 left-3  ${currentMessage.length >= 500 ? "text-red-500" : "text-yellow-400"}`}
        >
          {currentMessage.length > 475 && (
            <div>
              <span>{500 - currentMessage.length}</span>
            </div>
          )}
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
            if (user != null) {
              if (currentMessage.length > 500) {
                return;
              }
              submit(currentMessage, setCurrentMessage);
              return;
            }
          }}
        >
          Send
        </Button>
      </div>
    </form>
  );
};

export default Chat;
