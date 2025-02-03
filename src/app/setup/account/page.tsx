import { getUserData } from "@/utils/server-utils/utils";
import React from "react";
import AccountSetupClient from "./client";

export default async function AccountSetup() {
  const user = await getUserData();
  if (!user) return <></>;
  return <AccountSetupClient user={user} />;
}
