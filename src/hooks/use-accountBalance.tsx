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
        const res = await fetch("/api/plaid/get-account", {
          method: "POST",
          body: JSON.stringify({
            institutionId,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch account data");
        }

        const data = await res.json();

        return data.accounts || [];
      } catch (e) {
        console.log(e);
        return [];
      }
    },
  });
};
