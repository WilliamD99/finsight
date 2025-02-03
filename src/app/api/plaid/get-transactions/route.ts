import { NextRequest, NextResponse } from "next/server";
import plaidClient from '@/utils/plaid/config'

export async function GET(request: NextRequest) {
    try {
        // For demo purposes, we're hardcoding the access token
        const startDate = '2000-01-01';
        const endDate = '2025-02-01';

        let response = await plaidClient.transactionsGet({
            access_token: process.env.PLAID_ACCESS_TOKEN!,
            start_date: startDate,
            end_date: endDate,

        })
        let data = response.data
        console.log(data)
        return NextResponse.json({
            transactions: data.transactions
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