import { useQuery } from "@tanstack/react-query";

const useImportedBankAccounts = () => {
  const user = localStorage.getItem("user_profile");
  const userId = user ? JSON.parse(user).id : null;

  return useQuery({
    queryKey: ["bank-accounts", userId],
    queryFn: async () => {
      const response = await fetch("/api/supabase/get-accounts");
      return response.json();
    },
  });
};

export default useImportedBankAccounts;
