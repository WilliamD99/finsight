import { createClient } from "@/utils/supabase/server";
import React from "react";
import DashboardAccountPageClient from "./client";
import plaidClient from "@/utils/plaid/config";
import { redirect } from "next/navigation";
import { decryptToken } from "@/utils/server-utils/utils";
import { getCurrentDate, getDateNDaysBefore } from "@/utils/data";

export default async function DashboardAccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const supabase = await createClient();

  const { id: institutionId } = await params;
  let { range = "30" } = await searchParams;

  // Get the acccess token for the current institution
  const tokenData = await supabase
    .from("Access Token Table")
    .select("token")
    .eq("item_id", institutionId)
    .single();
  let encrytedToken = tokenData.data?.token;
  if (!encrytedToken) redirect("/error");
  let decrytedToken = decryptToken(encrytedToken);

  let currentDate = getCurrentDate();
  let startDate = getDateNDaysBefore(currentDate, parseInt(range));

  // Get the transactions from Supabase
  const { data, error } = await supabase
    .from("Transactions")
    .select("*")
    .eq("access_id", institutionId)
    .lte("date", currentDate)
    .gte("date", startDate);
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
