import { createClient } from "@/utils/supabase/server";
import React from "react";
import DashboardAccountPageClient from "./client";
import plaidClient from "@/utils/plaid/config";
import { redirect } from "next/navigation";
import { decryptToken } from "@/utils/server-utils/utils";

export default async function DashboardAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  const { id: institutionId } = await params;

  // Get the acccess token for the current institution
  const tokenData = await supabase
    .from("Access Token Table")
    .select("token")
    .eq("item_id", institutionId)
    .single();
  let encrytedToken = tokenData.data?.token;
  if (!encrytedToken) redirect("/error");
  let decrytedToken = decryptToken(encrytedToken);

  // Get the transactions from Supabase
  const { data, error } = await supabase
    .from("Transactions")
    .select("*")
    .eq("access_id", institutionId)
    .limit(5);

  // Get all the account for the current institution
  const { data: accountsBalanceData } = await plaidClient.accountsBalanceGet({
    access_token: decrytedToken,
  });
  let accounts = accountsBalanceData.accounts;

  return (
    <>
      <DashboardAccountPageClient
        id={institutionId}
        data={data ?? []}
        accounts={accounts}
      />
    </>
  );
}
