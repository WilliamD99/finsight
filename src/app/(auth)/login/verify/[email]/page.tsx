import React from "react";
import VerifyLoginPageClient from "./client";
import { redirect } from "next/navigation";

export default async function VerifyLoginPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  if (!email) redirect("/error");

  let decodedEmail = decodeURIComponent(email);
  return <VerifyLoginPageClient email={decodedEmail} />;
}
