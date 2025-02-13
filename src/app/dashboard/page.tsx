import React from "react";
import DashboardClient from "./client";
import { redirect } from "next/navigation";
import { checkUserSetup } from "@/utils/server-utils/utils";

export default async function DashboardPage() {
  let hasSetup = await checkUserSetup();
  if (!hasSetup) redirect("/setup/account");

  return <DashboardClient />;
}
