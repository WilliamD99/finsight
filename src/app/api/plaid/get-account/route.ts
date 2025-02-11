import { NextRequest, NextResponse } from "next/server";
import plaidClient from "@/utils/plaid/config";
import { createClient } from "@/utils/supabase/server";
import { decryptToken } from "@/utils/server-utils/utils";

export async function POST(request: NextRequest) {
  const { institutionId } = await request.json();
  try {
    const supabase = await createClient();

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
      const { data: balanceResponse }: { data: any } =
        await plaidClient.accountsBalanceGet({
          access_token: decrytedToken,
        });

      console.log(balanceResponse);
      accountBalances.push({
        accounts: balanceResponse.accounts,
        name: balanceResponse.item?.institution_name ?? "",
      });
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
