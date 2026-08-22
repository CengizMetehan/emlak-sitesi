import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function YonlendirPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/giris");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  redirect("/admin");
}
