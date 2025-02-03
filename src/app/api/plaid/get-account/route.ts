import { NextRequest, NextResponse } from "next/server";
import plaidClient from '@/utils/plaid/config'
import { ACCESS_TOKEN } from "@/utils/plaid/config";

export async function GET(request: NextRequest) {
    try {
        // For demo purposes, we're hardcoding the access token

        let response = await plaidClient.accountsGet({
            access_token: ACCESS_TOKEN,
        })
        let data = response.data
        return NextResponse.json({
            accounts: data
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