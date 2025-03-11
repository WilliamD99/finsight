import { createClient } from "@/utils/supabase/server";
import React from "react";
import plaidClient from "@/utils/plaid/config";
import { decryptToken } from "@/utils/server-utils/utils";
import ImportAccountsClient from "./client";
import { fetchInstitutionByID } from "@/utils/plaid/utils";

export default async function ImportAccounts({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id: institutionId } = await params;

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return <div>Error</div>;
  }

  // retrieve the access token for this institution
  const { data: accessToken, error: accessTokenError } = await supabase
    .from("Access Token Table")
    .select("token")
    .eq("item_id", institutionId)
    .eq("user_id", user.user.id)
    .single();

  if (accessTokenError) {
    return <div>Error</div>;
  }

  // Get the accounts from Plaid
  const { data: accounts } = await plaidClient
    .accountsGet({
      access_token: decryptToken(accessToken.token),
    })
    .catch((err) => {
      console.error("Plaid API Error:", err);
      throw err;
    });

  // Get the accounts from Supabase
  // If the account is already in the database, then skip it
  // If the account is not in the database, then add it
  const { data: supabaseAccounts } = await supabase
    .from("Accounts")
    .select("*")
    .eq("ins_id", institutionId);

  let accountsToImport = [];
  if (supabaseAccounts) {
    // Filter the accounts from Plaid to only include the accounts that are not in the database
    accountsToImport = accounts.accounts.filter(
      (account) =>
        !supabaseAccounts.some((a) => a.account_id === account.account_id)
    );
  } else {
    accountsToImport = accounts.accounts;
  }

  let institutionData = await fetchInstitutionByID(institutionId);
  let hasImportedAccounts = supabaseAccounts
    ? supabaseAccounts.length > 0
    : false;
  return (
    <ImportAccountsClient
      name={institutionData?.name ?? ""}
      accounts={accountsToImport}
      institutionId={institutionId}
      importTransactionReady={hasImportedAccounts}
    />
  );
}
