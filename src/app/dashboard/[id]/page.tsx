import React from "react";
import DashboardAccountPageClient from "./client";
import { checkUserSetup } from "@/utils/server-utils/utils";
import { redirect } from "next/navigation";

export default async function DashboardAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let hasSetup = await checkUserSetup();
  if (!hasSetup) redirect("/setup/account");

  const { id: institutionId } = await params;

  return (
    <>
      <DashboardAccountPageClient id={institutionId} />
    </>
  );
}
