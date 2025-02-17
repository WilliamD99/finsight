import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();

const fetchTransactionDateRange = async (): Promise<{
  min: Date;
  max: Date;
} | null> => {
  const { data, error } = await supabase
    .from("Transactions")
    // ask for the min and max of the date column
    .select("date.min(), date.max()")
    .single();
  if (error) return null;

  return {
    min: new Date(data.min),
    max: new Date(data.max),
  };
};

export const useTransactionDateRange = () => {
  return useQuery<{
    min: Date;
    max: Date;
  } | null>({
    queryKey: ["transaction-range"],
    queryFn: fetchTransactionDateRange,
  });
};
