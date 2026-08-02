"use client";

import { useSession } from "next-auth/react";

export default function DashboardHomePage() {
  const { data: session } = useSession();
  const firstName = session?.user?.firstName ?? "";
  const lastName = session?.user?.lastName ?? "";

  return (
    <h1 className="text-3xl font-semibold text-white">
      Welcome back {firstName} {lastName}
    </h1>
  );
}