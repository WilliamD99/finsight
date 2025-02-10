import { useQuery } from "@tanstack/react-query";

const useInstitutions = ({ id }: { id?: string } = {}) => {
  return useQuery<{
    institutions: {
      item_id: string;
      name: string;
    }[];
  }>({
    queryKey: ["institutions", id],
    queryFn: async () => {
      const res = await fetch("/api/supabase/get-institutions", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      return res.json();
    },
  });
};

export default useInstitutions;
