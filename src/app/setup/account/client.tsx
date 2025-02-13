"use client";

import React from "react";
import SetupAccountDialog from "@/components/dialogs/SetupAccountDialog";
import { User } from "@supabase/supabase-js";
import { Tables } from "@/types/supabase";

export default function AccountSetupClient({
  user,
  profile,
}: {
  user: User;
  profile: Tables<"User Profile"> | null;
}) {
  return <SetupAccountDialog user={user} profile={profile} />;
}
