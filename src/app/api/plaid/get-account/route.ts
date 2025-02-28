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
    if (!userData.data.user)
      return NextResponse.json(
        {
          accounts: [],
        },
        { status: 200 }
      );

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
      console.log(decrytedToken);
      // Fetch account balances from Plaid
      const { data: balanceResponse }: { data: AccountsGetResponse } =
        await plaidClient
          .accountsBalanceGet({
            access_token: decrytedToken,
          })
          .catch((err) => {
            console.error("Plaid API Error:", err);
            throw err;
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
      let { error } = await supabase.from("Accounts").upsert(
        accountAddData.map((account) => ({
          ...account,
          updated_at: new Date().toISOString(),
        })) as any,
        {
          onConflict: "account_id",
        }
      );
      console.log(error);
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
