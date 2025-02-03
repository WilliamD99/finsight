import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import { filterTransactionsByKeys, getCurrentDate, getDateNDaysBefore } from "@/utils/data";
import plaidClient from "@/utils/plaid/config";
import { Transaction } from "plaid";
import { decryptToken } from "@/utils/server-utils/utils";

const desiredKeys: (keyof Transaction)[] = [
    "amount",
    "date",
    "merchant_name",
    "payment_channel",
    "iso_currency_code",
    "logo_url",
    "name",
    "transaction_id",
    "account_id"
];

// This route need to be given a access token id profile 
export async function POST(request: NextRequest) {
    try {
        const { id, range, item_id } = await request.json()
        let supabase = await createClient()

        // Retrieve the access token profile
        let { data: tokenData } = await supabase.from("Access Token Table").select("token").eq("id", id).single()
        let encryptedToken = tokenData?.token

        if (!encryptedToken) return NextResponse.json({
            error: 'Error getting access token',
        }, {
            status: 500
        })

        // Need to decrypt the token before use
        // const decryptToken = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_KEY!).toString(CryptoJS.enc.Utf8)
        const decryptedToken = decryptToken(encryptedToken)

        // From the token, request the transactions from plaid to import
        let currentDate = getCurrentDate()
        let startDate = getDateNDaysBefore(currentDate, parseInt(range))

        let transactionsResponse = await plaidClient.transactionsGet({
            access_token: decryptedToken,
            start_date: startDate,
            end_date: currentDate
        })
        let transactions = transactionsResponse.data.transactions
        // console.log(transactions)
        let filteredTransactions = filterTransactionsByKeys(transactions, desiredKeys)

        // Need to append access_id to each of the transactions 
        // To keep track of which account 
        filteredTransactions = filteredTransactions.map(transaction => { return { ...transaction, access_id: item_id } })
        // Now add these records to Supabase table
        let { error } = await supabase.from("Transactions").upsert(filteredTransactions)
        console.log(error)
        if (error) {
            return NextResponse.json({
                error: 'Error inserting transactions',
            }, {
                status: 500
            })
        }

        return NextResponse.json({
            institutions: "gaga"
        }, {
            status: 200
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error: 'Error getting transactions',
        }, {
            status: 500
        })
    }
}