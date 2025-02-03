"use client";

import React from "react";
import SetupAccountDialog from "@/components/dialogs/SetupAccountDialog";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function AccountSetupClient({ user }: { user: User }) {
  const router = useRouter();

  const onSuccess = () => {
    router.push("/setup/bank");
  };

  return (
    <>
      <SetupAccountDialog user={user} type="insert" onSuccess={onSuccess} />
    </>
  );
}
