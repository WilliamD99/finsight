import { NextRequest, NextResponse } from "next/server";
import { Products, CountryCode } from "plaid";
import plaidClient from "@/utils/plaid/config";
import { createClient } from "@/utils/supabase/server";
import { decryptToken } from "@/utils/server-utils/utils";

export async function POST(request: NextRequest) {
  try {
    const { institution_id } = await request.json();
    const supabase = await createClient();

    // get current user
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json(
        { error: "Error getting user" },
        { status: 500 }
      );
    }
    // Get the access token
    let { data: accessTokenResponse, error } = await supabase
      .from("Access Token Table")
      .select("token")
      .eq("item_id", institution_id)
      .single();

    if (error || !accessTokenResponse) {
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
    let access_token = decryptToken(accessTokenResponse.token);

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: user.user.id },
      client_name: "FinSight",
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Ca],
      language: "en",
      access_token,
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
