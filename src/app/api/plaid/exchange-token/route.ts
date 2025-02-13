import { NextRequest, NextResponse } from "next/server";
import plaidClient from "@/utils/plaid/config";

import { createClient } from "@/utils/supabase/server";
import CryptoJS from "crypto-js";
import { revalidatePath } from "next/cache";
import { CountryCode } from "plaid";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (data && !error) {
    try {
      const { public_token, user_id, institution_id } = await request.json();
      // Exchange public token for access token
      const response = await plaidClient.itemPublicTokenExchange({
        public_token,
      });
      let plaidData = response.data;
      let token = plaidData.access_token;
      console.log(response);
      if (plaidData) {
        // Encrypt token before storing in database
        try {
          // Need to add the institution data into the database
          let insDataRes = await plaidClient.institutionsGetById({
            institution_id: institution_id,
            country_codes: ["CA" as CountryCode],
          });
          await supabase.from("Institutions").upsert({
            id: institution_id,
            name: insDataRes.data.institution.name,
          });

          const encryptedToken = CryptoJS.AES.encrypt(
            token,
            process.env.ENCRYPTION_KEY!
          ).toString();
          // Store access token in database
          let { data: supabaseRes, error } = await supabase
            .from("Access Token Table")
            .insert({
              token: encryptedToken,
              item_id: institution_id,
              user_id: user_id,
            })
            .select("id")
            .single();

          revalidatePath("/dashboard", "layout");
          return NextResponse.json(
            {
              message: "Success",
              id: supabaseRes?.id,
            },
            {
              status: 201,
            }
          );
        } catch (e) {
          return NextResponse.json(
            {
              error: "Error creating record in the database",
            },
            {
              status: 500,
            }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: "Error exchanging public token",
          },
          {
            status: 500,
          }
        );
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: "Error exchanging public token",
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json(
      {
        error: "Not authenticated",
      },
      {
        status: 404,
      }
    );
  }
}
