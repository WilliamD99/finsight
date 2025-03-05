import { getUserData } from "@/utils/server-utils/actions";
import React from "react";
import AccountSetupClient from "./client";
import { createClient } from "@/utils/supabase/server";

export default async function AccountSetup() {
  const supabase = await createClient();

  const user = await getUserData();
  if (!user) return <></>;
  const { data: userProfile } = await supabase
    .from("User Profile")
    .select("*")
    .eq("id", user.id)
    .single();

  return <AccountSetupClient user={user} profile={userProfile} />;
}
