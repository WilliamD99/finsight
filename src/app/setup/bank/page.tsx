import React from "react";
import { getUserData } from "@/utils/server-utils/utils";
import SetupBankClient from "./client";

export default async function SetupBank() {
  const user = await getUserData();
  if (!user) return <></>;
  return <SetupBankClient user={user} />;
}
