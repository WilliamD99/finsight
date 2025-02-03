import { NextRequest, NextResponse } from "next/server";
import plaidClient from '@/utils/plaid/config'
import { ACCESS_TOKEN } from "@/utils/plaid/config";
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const { user_id } = await request.json();

        const supabase = await createClient()
        const { data, error } = await supabase.from("Access Token Table").select("*").eq('id', user_id)

        if (error) {
            return NextResponse.json({
                error: 'Error getting access token',
            }, {
                status: 500
            })
        }

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