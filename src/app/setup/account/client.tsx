"use client";

import React from "react";
import SetupAccountDialog from "@/components/dialogs/SetupAccountDialog";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";

export default function AccountSetupClient({
  user,
  profile,
}: {
  user: User;
  profile: Tables<"User Profile"> | null;
}) {
  const router = useRouter();

  const onSuccess = () => {
    router.push("/setup/bank");
  };

  return (
    <>
      <SetupAccountDialog
        user={user}
        profile={profile}
        type="update"
        onSuccess={onSuccess}
      />
    </>
  );
}
