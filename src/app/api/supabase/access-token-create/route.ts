// When user create an access token with Plaid (connect bank)
// The access token will be saved into Supabase table

import { NextRequest, NextResponse } from "next/server";
import { PlaidApi, Products, CountryCode } from 'plaid'
import plaidClient from "@/utils/plaid/config";
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (data && !error) {
        try {
            const { client_user_id } = await request.json()
            console.log(client_user_id)
            return NextResponse.json({ link_token: "hello" })
        } catch (error) {
            console.log(error)
            return NextResponse.json({
                error: 'Error creating link token',
            }, {
                status: 500
            })
        }
    } else {
        return NextResponse.json({
            error: 'Not authenticated',
        }, {
            status: 404
        })
    }
}