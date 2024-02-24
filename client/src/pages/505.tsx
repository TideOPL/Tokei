import { useAuth, useUser } from "@clerk/nextjs";
import Nav from "~/component/nav/Nav";

export default function Custom404() {
  const { user } = useUser();
  const { signOut, getToken } = useAuth();

  <div>abcde</div>;

  //@ts-ignore
  return <Nav user={user} signOut={() => signOut()} />;
}
