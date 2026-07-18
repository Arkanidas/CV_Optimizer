import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./logout";
import Sidebar from "../../components/sidebar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen min-h-dvh bg-[#0d0b14]">
     <Sidebar />
      <div className="absolute right-6 top-6 flex items-center gap-3">
       
      <LogoutButton />
      </div>
    </div>
  );
}