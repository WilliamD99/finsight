import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentDate, getDateNDaysBefore } from "@/utils/data";
import plaidClient from "@/utils/plaid/config";
import { decryptToken } from "@/utils/server-utils/utils";

export async function POST(request: NextRequest) {
  const { id, range } = await request.json();

  try {
    const supabase = await createClient();

    let currentDate = getCurrentDate();
    let startDate = getDateNDaysBefore(currentDate, parseInt(range));

    const token = await supabase
      .from("Access Token Table")
      .select("token")
      .eq("item_id", "ins_48")
      .single();
    let encrytedToken = token.data?.token;
    let decrytedToken = decryptToken(encrytedToken!);

    const { data: testData } = await plaidClient.transactionsGet({
      access_token: decrytedToken,
      start_date: startDate,
      end_date: currentDate,
    });

    // Get the transactions from Supabase
    return NextResponse.json(
      {
        transactions: testData.transactions,
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
