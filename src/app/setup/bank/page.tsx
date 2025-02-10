import React from "react";
import SetupBankClient from "./client";
import { getUserData } from "@/utils/server-utils/actions";

export default async function SetupBank() {
  const user = await getUserData();
  if (!user) return <></>;
  return <SetupBankClient user={user} />;
}
