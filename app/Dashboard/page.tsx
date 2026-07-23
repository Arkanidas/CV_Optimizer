import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardMain from "./dashboardMain";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);



  if (!session) {
    redirect("/login");
  }

  return <DashboardMain />;
   
}