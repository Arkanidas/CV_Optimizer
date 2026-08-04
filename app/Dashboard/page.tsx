"use client";

import { useSession } from "next-auth/react";

export default function DashboardHomePage() {
  const { data: session } = useSession();
  const firstName = session?.user?.firstName ?? "";

  return (
    <h1 className="text-3xl font-semibold text-white">
      Welcome back {firstName}
    </h1>
  );
}