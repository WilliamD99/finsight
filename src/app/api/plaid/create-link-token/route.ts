import { NextRequest, NextResponse } from "next/server";
import { PlaidApi, Products, CountryCode } from "plaid";
import plaidClient from "@/utils/plaid/config";

export async function POST(request: NextRequest) {
  try {
    const { client_user_id } = await request.json();

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id },
      client_name: "FinSight",
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Ca],
      language: "en",
    });
    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Error creating link token",
      },
      {
        status: 500,
      }
    );
  }
}
