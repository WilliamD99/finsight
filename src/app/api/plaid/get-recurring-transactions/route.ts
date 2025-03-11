import { NextRequest, NextResponse } from "next/server";
import plaidClient from "@/utils/plaid/config";
// import { ACCESS_TOKEN } from "@/utils/plaid/config";

export async function GET(request: NextRequest) {
  try {
    // let response = await plaidClient.transactionsRecurringGet({
    //     access_token: ACCESS_TOKEN,
    //     secret: process.env.PLAID_SECRET,
    // })
    // let data = response.data

    return NextResponse.json(
      {
        transactions: "data",
      },
      { status: 200 }
    );
  } catch (e: any) {
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
