import { NextRequest, NextResponse } from "next/server";
import plaidClient from '@/utils/plaid/config'
import { createClient } from "@/utils/supabase/server";
import { decryptToken } from "@/utils/server-utils/utils";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { institution_id } = await request.json()

        // Retrieve access token
        const data = await supabase.from("Access Token Table").select("token").eq("item_id", institution_id).single()

        let encrytedToken = data.data?.token

        if (!encrytedToken) {
            return NextResponse.json({
                error: 'Error getting access token',
            }, {
                status: 500
            })
        }

        let decrytedToken = decryptToken(encrytedToken)

        let response = await plaidClient.accountsBalanceGet({
            access_token: decrytedToken,
        })
        let accountBalanceData = response.data.accounts
        console.log(accountBalanceData)

        return NextResponse.json({
            balance: "data.accounts"
        }, { status: 200 })

    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error: 'Error getting transactions',
        }, {
            status: 500
        })
    }
}