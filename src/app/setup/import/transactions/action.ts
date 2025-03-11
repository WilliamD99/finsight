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
    const data = {
      id: formData.id,
      range: formData.range,
      item_id: formData.item_id,
    };
    let supabase = await createClient();

    // Retrieve the access token profile
    let { data: tokenData, error: tokenError } = await supabase
      .from("Access Token Table")
      .select("token")
      .eq("id", data.id)
      .single();

    if (tokenError) {
      return {
        success: false,
        error: "Failed to retrieve access token",
        details: tokenError.message,
      };
    }

    let encryptedToken = tokenData?.token;
    if (!encryptedToken) {
      return {
        success: false,
        error: "Access token not found",
      };
    }

    // Need to decrypt the token before use
    let decryptedToken: string;
    try {
      decryptedToken = decryptToken(encryptedToken);
    } catch (decryptError) {
      return {
        success: false,
        error: "Failed to decrypt access token",
        details: (decryptError as Error).message,
      };
    }

    let currentDate, startDate;

    if (typeof data.range === "string") {
      currentDate = getCurrentDate();
      startDate = getDateNDaysBefore(currentDate, parseInt(data.range));
    } else {
      if (!data.range.to || !data.range.from) {
        return {
          success: false,
          error: "Invalid date range provided",
        };
      }
      currentDate = data.range.to.toISOString().split("T")[0];
      startDate = data.range.from.toISOString().split("T")[0];
    }

    let transactionsResponse;
    try {
      const { data: plaidData } = await plaidClient.transactionsGet({
        access_token: decryptedToken,
        start_date: startDate,
        end_date: currentDate,
      });
      transactionsResponse = plaidData;
    } catch (plaidError: any) {
      return {
        success: false,
        error: "Failed to fetch transactions from Plaid",
        error_code: plaidError?.response?.data?.error_code,
        details:
          plaidError?.response?.data?.error_message || plaidError.message,
      };
    }

    // return {
    //   success: false,
    //   // transactions: transactionsResponse.transactions,
    //   error_code: "ITEM_LOGIN_REQUIRED",
    // };

    if (!transactionsResponse?.transactions) {
      return {
        success: false,
        error: "No transactions data received from Plaid",
      };
    }

    let transactions = transactionsResponse.transactions;
    let filteredTransactions = filterTransactionsByKeys(
      transactions,
      desiredKeys
    );

    if (filteredTransactions.length === 0) {
      return {
        success: false,
        error: "No transactions found in the specified date range",
      };
    }

    // Need to append access_id to each of the transactions
    filteredTransactions = filteredTransactions.map((transaction) => {
      let { personal_finance_category, transaction_id, ...rest } = transaction;
      return {
        ...rest,
        access_id: data.item_id,
        transaction_id: transaction_id!,
        category_2: transaction.personal_finance_category?.primary || null,
      };
    });

    // Now add these records to Supabase table
    let { error: upsertError } = await supabase
      .from("Transactions")
      .upsert(filteredTransactions as Tables<"Transactions">[]);

    if (upsertError) {
      console.log(upsertError);
      return {
        success: false,
        error: "Failed to save transactions to database",
        details: upsertError?.message,
      };
    }

    return {
      success: true,
      count: filteredTransactions.length,
    };
  } catch (e) {
    console.error("Unexpected error during transaction import:", e);
    return {
      success: false,
      error: "An unexpected error occurred",
      details: (e as Error).message,
    };
  }
}
