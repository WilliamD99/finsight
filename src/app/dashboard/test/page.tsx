import React from "react";
import TestPageClient from "./client";
import { getUserData } from "@/utils/server-utils/actions";

export default async function TestPage() {
  const user = await getUserData();
  if (!user) return <></>;

  return (
    <div>
      <TestPageClient user={user} />
    </div>
  );
}
