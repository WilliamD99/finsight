import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/types/supabase";

export const useTransactionData = ({
  institutionId,
  range,
}: {
  institutionId?: string;
  range: string;
}) => {
  const user = localStorage.getItem("user_profile");
  const userId = user ? JSON.parse(user).id : null;

  return useQuery<Tables<"Transactions">[] | []>({
    queryKey: ["transactions", userId, institutionId, range],
    queryFn: async (): Promise<Tables<"Transactions">[] | []> => {
      try {
        const res = await fetch("/api/supabase/get-transactions", {
          method: "POST",
          body: JSON.stringify({
            id: institutionId,
            range,
          }),
        });
        let data = await res.json();

        return data.transactions;
      } catch (e) {
        console.log(e);
        return [];
      }
    },
  });
};
