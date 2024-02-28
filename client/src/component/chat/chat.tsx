import { useClerk, useUser } from "@clerk/nextjs";
import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { env } from "~/env.mjs";
import { Channel } from "~/interface/Channel";
import Message from "./message";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import ChatIdentity from "./chat-identity";
import ChatEmotes from "./chat-emotes";
import { UserResource } from "@clerk/types";
import { useRouter } from "next/router";
import { IBan, ITimeout, isIBan } from "~/interface/chat";
import useModerate from "~/hook/useModerate";
import TimeoutClock from "../ui/timeout-clock";

interface Props {
  channel: Channel;
  setViewers: React.Dispatch<React.SetStateAction<string>>;
  setDisableHotkey: React.Dispatch<React.SetStateAction<boolean>>;
  getToken: () => Promise<string | null>;
}

interface FormProps {
  chatStatus: ITimeout | IBan | null;
  setChatStatus: React.Dispatch<React.SetStateAction<ITimeout | IBan | null>>;
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
    | Array<{
        username: string;
        color: string;
        message: string;
        deleted: boolean;
      }>
    | Array<any>
  >([]);
  const { isSignedIn, user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [visible, setVisible] = useState(true);
  const [color, setColor] = useState("#FFFFFF");
  const [chatStatusObj, setChatStatusObj] = useState<IBan | ITimeout | null>(
    null,
  );
  const router = useRouter();
  const { chatStatus } = useModerate(getToken, channel);

  let count = 0;

  useEffect(() => {
    // Create a socket connection
    const socket = io(`${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_EXPRESS_PORT}`);
    setSocket(socket);
    setMessages([]);
    const messageClone: Array<{
      username: string;
      color: string;
      message: string;
      deleted: boolean;
    }> = [];

    const fetch = async () => {
      const data = await chatStatus(channel.clerk_id);
      if (!data) {
        return;
      }
      if (data.type == "timeout") {
        const _data = data.object as ITimeout;
        if (parseInt(_data.timestamp_mutedEnd) > Date.now()) {
          setChatStatusObj(_data);
        }
      }
      if (data.type == "ban") {
        const _data = data.object as IBan;
        setChatStatusObj(_data);
      }
    };

    fetch();

    socket.on(`stream_${channel.username}`, (status) => {
      setTimeout(() => router.reload(), 5000);
    });

    socket.on(`chat_${channel.username}`, (message: string) => {
      if (message.includes(`@ban`) || message.includes(`@timeout`)) {
        const timeOutRegexPattern =
          /@timeout-(.*?)-reason-(.*?)-end-(.*?)-moderator-(.*)/;
        const banRegexPattern =
          /@ban-(.*?)-reason-(.*?)-end-(.*?)-moderator-(.*)/;

        const timeOutMatch = message.match(timeOutRegexPattern);
        const banMatch = message.match(banRegexPattern);

        if (
          (timeOutMatch && timeOutMatch.length >= 1) ||
          (banMatch && banMatch.length >= 1)
        ) {
          //@ts-expect-error
          const user = !timeOutMatch ? banMatch[1] : timeOutMatch[1];
          const updatedMessages: Array<{
            username: string;
            color: string;
            message: string;
            deleted: boolean;
          }> = [];
          for (let i = 0; i < messageClone.length; i++) {
            const message = messageClone[i];
            if (!message) {
              continue;
            }

            if (message.username === user) {
              updatedMessages.push({ ...message, deleted: true });
              continue;
            }
            updatedMessages.push(message);
          }
          setMessages(updatedMessages);
        }
      }

      if (message.includes(`@timeout-${user?.username}`)) {
        const regexPattern =
          /@timeout-(.*?)-reason-(.*?)-end-(.*?)-moderator-(.*)/;

        // Match the string against the regular expression
        const matchResult = message.match(regexPattern);

        // Extract the captured groups
        if (matchResult && matchResult.length >= 4) {
          const reason = matchResult[2];
          const timestampEnd = matchResult[3];
          const moderator = matchResult[4];

          setChatStatusObj({
            reason: reason || "",
            timestamp_mutedEnd: timestampEnd?.toString() || "",
            moderator: moderator || "",
            active: true,
          });
        }
      }
      if (message.includes(`@untimeout-${user?.username}`)) {
        setChatStatusObj(null);
      }

      if (message.includes(`@ban-${user?.username}`)) {
        const regexPattern = /@ban-(.*?)-reason-(.*?)-moderator-(.*)/;

        // Match the string against the regular expression
        const matchResult = message.match(regexPattern);

        // Extract the captured groups
        if (matchResult && matchResult.length >= 4) {
          const reason = matchResult[2];
          const moderator = matchResult[3];

          setChatStatusObj({
            reason: reason || "",
            moderator: moderator || "",
            active: true,
          });
        }
      }

      if (message.includes(`@unban-${user?.username}`)) {
        setChatStatusObj(null);
      }
    });

    // Listen for incoming messages
    socket.on(`message_${channel.username}`, (message) => {
      message.deleted = false;

      if (count >= 100) {
        messageClone.slice(1);
        messageClone.push(message);
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.slice(1);

          return [...updatedMessages, message];
        });
        return;
      }

      messageClone.push(message);
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
  }, [isSignedIn, channel]);

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
        className={`relative flex max-h-[calc(100vh-64px)] max-w-[350px] flex-col justify-between border-l border-zinc-500 bg-[#fefefe]  font-noto-sans text-white  dark:bg-back-tertiary ${visible ? "w-[18%]" : "w-[0%]"} overflow-hidden transition-all duration-300 delay-150`}
      >
        <div className="relative flex h-full max-h-[80px] flex-initial items-center justify-between overflow-hidden border-b-2 border-b-zinc-700 shadow-md">
          <div className="w-full">
            <Button
              size={"icon"}
              variant={"link"}
              className="justify-start p-0 px-0 text-start hover:bg-none hover:text-zinc-900 dark:hover:bg-none dark:hover:text-zinc-50"
              onClick={() => setVisible(!visible)}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
          <div className="title text-center font-noto-sans font-bold">CHAT</div>
          <div className="w-full" />
        </div>
        <div className="relative h-full max-h-[calc(85%-80px)] overflow-y-hidden">
          <div className="h-full overflow-x-hidden overflow-y-scroll px-2 pt-1">
            {messages != null &&
              messages.map((message) => (
                <div ref={divRef}>
                  <Message
                    chatRoom={channel}
                    username={message.username}
                    color={message.color}
                    message={message.message}
                    deleted={message.deleted}
                    icons={message.icons}
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="mx-0 flex h-40 flex-initial flex-col px-2 pt-3 dark:bg-back-secondary">
          <Form
            //@ts-expect-error
            user={user}
            color={color}
            getToken={getToken}
            setColor={setColor}
            socket={socket}
            setDisableHotkey={setDisableHotkey}
            chatStatus={chatStatusObj}
            setChatStatus={setChatStatusObj}
          />
        </div>
      </div>
      <div
        className={`${!visible ? "w-[2.5%]" : "w-[0%] max-w-[0vw]"} overflow-hidden transition-all duration-300 delay-150`}
      >
        <Button
          variant={"link"}
          size={"icon"}
          className={`h-24 max-h-24 w-full justify-center text-start hover:bg-none hover:text-zinc-900 dark:hover:bg-none dark:hover:text-zinc-50 ${!visible ? "w-[100%]" : "w-[0%]"} overflow-hidden transition-all duration-300 delay-150`}
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
  chatStatus,
  setChatStatus,
}: FormProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [error, setError] = useState(false);
  const clerk = useClerk();
  const [timeOut, setTimeOut] = useState<ITimeout | null>(null);
  const [chatBan, setChatBan] = useState<IBan | null>(null);

  useEffect(() => {
    if (chatStatus) {
      if (isIBan(chatStatus)) {
        setChatBan(chatStatus as IBan);
        return;
      }
      setTimeOut(chatStatus as ITimeout);
      return;
    }
    setTimeOut(null);
    setChatBan(null);
  }, [chatStatus]);

  const submit = (
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (chatStatus != null) {
      return;
    }
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
        {chatBan && (
          <div
            className={`absolute -left-2 -top-[4.7rem] flex h-20 w-full flex-col items-center justify-center bg-back-secondary`}
          >
            <div className="... max-w-[85%] truncate">
              You have been banned from the chat!
            </div>
            <div className="text-center text-sm">{chatBan.reason}</div>
          </div>
        )}

        <Input
          disabled={chatStatus != null}
          onFocus={() => setDisableHotkey(true)}
          onBlur={() => setDisableHotkey(false)}
          type={"text"}
          placeholder={chatStatus == null ? "Type a message..." : ""}
          value={currentMessage}
          onChange={(value) => setCurrentMessage(value.currentTarget.value)}
          onSubmit={(evt) => {
            if (user != null) {
              if (currentMessage.length > 500) {
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
        {timeOut && (
          <div className="absolute top-1 flex w-full flex-col items-center text-center  ">
            <div className="... max-w-[65%] truncate text-sm">
              You are currently timed out!
            </div>
            <TimeoutClock
              changeState={setChatStatus}
              timestamp={timeOut.timestamp_mutedEnd}
            />
          </div>
        )}
        {chatBan && (
          <div className="absolute top-1 flex w-full flex-col items-center text-center  "></div>
        )}
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
          className={`font-semibold transition-opacity dark:bg-primary dark:text-black hover:dark:bg-primary_lighter ${currentMessage.length == 0 && "cursor-default opacity-50 hover:dark:bg-primary"}`}
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
