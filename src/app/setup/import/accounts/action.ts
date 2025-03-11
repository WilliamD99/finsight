"use server";
import { AccountImportFormSchema } from "@/utils/form/schema";
import { createClient } from "@/utils/supabase/server";

export async function importAccountsAction(formData: AccountImportFormSchema) {
  try {
    const data = formData.accounts;
    let supabase = await createClient();

    let { data: insertedAccounts, error } = await supabase
      .from("Accounts")
      .upsert(
        data.map((account) => ({
          account_id: account.id,
          ins_id: account.item_id,
          name: account.name,
          type: account.type,
          subtype: account.subtype,
          mask: account.mask,
          balances: {
            current: account.balance,
            currency: account.currency,
          },
        })),
        {
          onConflict: "account_id",
        }
      );

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    return {
      success: true,
      count: data.length,
    };
  } catch (error) {
    console.error(error);
  }
}
