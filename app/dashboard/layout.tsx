import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardChrome from "@/components/DashboardChrome";

export default async function DashboardLayout({children,}: {children: React.ReactNode;}) {
    
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <DashboardChrome>{children}</DashboardChrome>;
}