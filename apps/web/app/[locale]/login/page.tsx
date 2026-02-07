import { auth } from "@repo/auth/auth";
import { redirect } from "next/navigation";
import LoginClient from "./login-client";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <LoginClient />;
}
