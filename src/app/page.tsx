import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/auth";

export default async function Home() {
  const token = await getServerToken();
  if (token) {
    redirect("/dashboard");
  }
  redirect("/login");
}
