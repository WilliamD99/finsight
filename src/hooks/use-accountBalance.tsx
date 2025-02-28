import { useQuery } from "@tanstack/react-query";
import { AccountBase } from "plaid";

export const useAccountBalance = ({
  institutionId,
}: {
  institutionId?: string;
}) => {
  return useQuery<
    | {
        name: string;
        accounts: AccountBase[];
      }[]
    | []
  >({
    queryKey: ["account-balance", institutionId],
    queryFn: async (): Promise<
      | {
          name: string;
          accounts: AccountBase[];
        }[]
      | []
    > => {
      try {
        // First try to get data from Supabase
        const supabaseRes = await fetch("/api/supabase/get-balance", {
          method: "POST",
          body: JSON.stringify({
            institutionId,
          }),
        });

        if (!supabaseRes.ok) {
          throw new Error("Failed to fetch from Supabase");
        }

        const supabaseData = await supabaseRes.json();

        // If we have data in Supabase, return it
        if (supabaseData.accounts && supabaseData.accounts.length > 0) {
          return supabaseData.accounts;
        }

        // If no data in Supabase, fetch from Plaid
        const plaidRes = await fetch("/api/plaid/get-account", {
          method: "POST",
          body: JSON.stringify({
            institutionId,
          }),
        });

        if (!plaidRes.ok) {
          throw new Error("Failed to fetch from Plaid");
        }

        const plaidData = await plaidRes.json();

        return plaidData.accounts || [];
      } catch (e) {
        console.log(e);
        return [];
      }
    },
  });
};
