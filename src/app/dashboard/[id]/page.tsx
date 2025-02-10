import React from "react";
import DashboardAccountPageClient from "./client";

export default async function DashboardAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: institutionId } = await params;

  return (
    <>
      <DashboardAccountPageClient id={institutionId} />
    </>
  );
}
