import { NextRequest, NextResponse } from "next/server";
import plaidClient from "@/utils/plaid/config";
import { createClient } from "@/utils/supabase/server";
import { decryptToken } from "@/utils/server-utils/utils";
import { AccountsGetResponse } from "plaid";

export async function POST(request: NextRequest) {
  const { institutionId } = await request.json();
  try {
    const supabase = await createClient();
    let userData = await supabase.auth.getUser();
    if (!userData.data.user) return [];

    let tokenQuery = supabase.from("Access Token Table").select("token");

    if (institutionId) {
      tokenQuery = tokenQuery.eq("item_id", institutionId);
    }
    const { data: tokenData, error } = await tokenQuery;
    if (error || tokenData.length === 0) {
      return NextResponse.json(
        {
          error: "Error getting transactions",
        },
        {
          status: 500,
        }
      );
    }
    let accountBalances = [];
    for (const { token } of tokenData) {
      let decrytedToken = decryptToken(token);
      // Fetch account balances from Plaid
      const { data: balanceResponse }: { data: AccountsGetResponse } =
        await plaidClient.accountsBalanceGet({
          access_token: decrytedToken,
        });

      accountBalances.push({
        accounts: balanceResponse.accounts,
        name:
          (balanceResponse.item as { institution_name?: string })
            ?.institution_name ?? "",
      });

      // Add the balance to the database
      let accountAddData = balanceResponse.accounts.map((account) => ({
        ...account,
        user_id: userData.data.user!.id,
        ins_id: balanceResponse.item.institution_id,
      }));
      let { data: accountAddResponse, error: accountAddError } = await supabase
        .from("Accounts")
        .insert(accountAddData);
      console.log(accountAddError, accountAddResponse);
    }

    return NextResponse.json(
      {
        accounts: accountBalances,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: "Error getting transactions",
      },
      {
        status: 500,
      }
    );
  }
}
