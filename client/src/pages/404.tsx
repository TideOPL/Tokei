import { useAuth, useUser } from "@clerk/nextjs";
import { Ghost } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import Footer from "~/component/nav/Footer";
import Nav from "~/component/nav/Nav";
import Sidebar from "~/component/nav/Sidebar";
import { Button } from "~/component/ui/button";

export default function Custom404() {
  const { user } = useUser();
  const { signOut, getToken } = useAuth();
  const router = useRouter();
  return (
    <div className="max-h-screen-ios flex h-screen max-h-screen flex-col overflow-hidden scroll-smooth bg-light-primary-light dark:bg-[#141516]">
      {/* @ts-expect-error */}
      <Nav user={user} signOut={() => signOut()} />
      <div className="flex max-h-[calc(100%-64px)] flex-1 overflow-hidden">
        <div className="flex">
          <Sidebar />
        </div>
        <div className="flex min-h-full w-full flex-col items-center justify-center">
          <div className=" relative flex h-full w-fit items-center justify-center">
            <div className="absolute -left-44">
              <Image
                src="/TokeiSadface1.png"
                width={150}
                height={150}
                alt=" Uh Oh! The content you are looking for is unavailable!"
              />
            </div>
            <div className="flex h-56 flex-col justify-center space-y-5 font-noto-sans text-2xl text-white">
              <div className="text-center text-3xl font-semibold text-primary">
                Uh Oh!
              </div>
              <div className="flex flex-initial ">
                &nbsp; The content you are looking for is unavailable!
              </div>
              <div className=" items-center text-center">
                <Button onClick={() => router.push("/")} variant="secondary">
                  Return to Browse
                </Button>
              </div>
            </div>
          </div>
          <div className="flex ">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
