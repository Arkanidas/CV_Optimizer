import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen min-h-dvh bg-[#0d0b14] px-6 py-8">
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
          {session!.user.firstName} {session!.user.lastName}
        </div>
        <LogoutButton />
      </div>

      <h1 className="text-2xl font-semibold text-white">Hello</h1>
    </div>
  );
}