import React from "react";
import DashboardClient from "./client";

import { getUserData } from "@/utils/server-utils/actions";
import { createClient } from "@/utils/supabase/server";
import plaidClient from "@/utils/plaid/config";
import CryptoJS from "crypto-js";
import { Transaction } from "plaid";
import SetupDialog from "@/components/dialogs/SetupDialog";
import { getCurrentDate, getDateNDaysBefore } from "@/utils/data";

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { start_date } = await searchParams;
  console.log(start_date);

  const user = await getUserData();
  if (!user) return <></>;
  // Get the metadata to see if user has setup the account (connect at least 1 bank account)
  let hasSetup = user.user_metadata.hasSetup;

  if (!hasSetup) {
    return <SetupDialog />;
  }

  const supabase = await createClient();

  // This will return a LIST of access token
  const { data: accessTokens, error } = await supabase
    .from("Access Token Table")
    .select("*")
    .eq("user_id", user.id);

  let transactions: Transaction[] = [];

  if (accessTokens && accessTokens?.length! > 0) {
    let transactionData = await Promise.all(
      accessTokens.map(async (token) => {
        try {
          let decryptedToken = CryptoJS.AES.decrypt(
            token.token,
            process.env.ENCRYPTION_KEY!
          ).toString(CryptoJS.enc.Utf8);
          let response = await plaidClient.transactionsGet({
            access_token: decryptedToken,
            start_date: getDateNDaysBefore(start_date ?? getCurrentDate()),
            end_date: start_date ?? getCurrentDate(),
          });
          let data = response.data;
          return data.transactions;
        } catch (e) {
          console.log(e);
          return null;
        }
      })
    );
    // The result from the Promise is an array of arrays, so we flatten it
    transactions = transactionData
      .filter((transaction) => transaction !== null)
      .flat();
  }

  return (
    <>
      <DashboardClient transactions={transactions} />
    </>
  );
}
