"use server";

import { createClient } from "@/utils/supabase/server";
import {
  filterTransactionsByKeys,
  getCurrentDate,
  getDateNDaysBefore,
} from "@/utils/data";
import plaidClient from "@/utils/plaid/config";
import { Transaction } from "plaid";
import { decryptToken } from "@/utils/server-utils/utils";
import { Tables } from "@/types/supabase";
import { TransactionImportFormSchema } from "@/utils/form/schema";

const desiredKeys: (keyof Transaction)[] = [
  "amount",
  "date",
  "merchant_name",
  "payment_channel",
  "iso_currency_code",
  "logo_url",
  "name",
  "transaction_id",
  "account_id",
  "category",
  "personal_finance_category",
];

// This route need to be given a access token id profile
export async function importTransactionAction(
  formData: TransactionImportFormSchema
) {
  try {
    // const { id, range, item_id } = await request.json();
    const data = {
      id: formData.id,
      range: formData.range,
      item_id: formData.item_id,
    };
    let supabase = await createClient();

    // Retrieve the access token profile
    let { data: tokenData } = await supabase
      .from("Access Token Table")
      .select("token")
      .eq("id", data.id)
      .single();
    let encryptedToken = tokenData?.token;

    if (!encryptedToken) return;

    // Need to decrypt the token before use
    // const decryptToken = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_KEY!).toString(CryptoJS.enc.Utf8)
    const decryptedToken = decryptToken(encryptedToken);

    let currentDate, startDate;

    if (typeof data.range === "string") {
      // From the token, request the transactions from plaid to import
      currentDate = getCurrentDate();
      startDate = getDateNDaysBefore(currentDate, parseInt(data.range));
    } else {
      currentDate = data.range.to!.toISOString().split("T")[0];
      startDate = data.range.from!.toISOString().split("T")[0];
    }

    let transactionsResponse = await plaidClient.transactionsGet({
      access_token: decryptedToken,
      start_date: startDate,
      end_date: currentDate,
    });
    let transactions = transactionsResponse.data.transactions;
    let filteredTransactions = filterTransactionsByKeys(
      transactions,
      desiredKeys
    );

    // Need to append access_id to each of the transactions
    // To keep track of which account
    filteredTransactions = filteredTransactions.map((transaction) => {
      // Exclude the whole personal_finance_category key-value
      let { personal_finance_category, transaction_id, ...rest } = transaction;
      return {
        ...rest,
        access_id: data.item_id,
        transaction_id: transaction_id!,
        category_2: transaction.personal_finance_category?.primary || null,
      };
    });
    // Now add these records to Supabase table
    let { error } = await supabase
      .from("Transactions")
      .upsert(filteredTransactions as Tables<"Transactions">[]);
    console.log(error);
    return;
  } catch (e) {
    console.log(e);
  }
}
