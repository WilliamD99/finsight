import { useQuery } from "@tanstack/react-query";
import { Institution } from "plaid";

const useInstitutions = () => {
  return useQuery<{
    institutions: Institution[];
  }>({
    queryKey: ["institutions"],
    queryFn: async () => {
      const res = await fetch("/api/plaid/get-institutions", {
        method: "GET",
      });
      return res.json();
    },
  });
};

export default useInstitutions;
