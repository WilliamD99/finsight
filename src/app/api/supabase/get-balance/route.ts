import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Extend the Accounts type to include Institutions
type AccountWithInstitution = Tables<"Accounts"> & {
  Institutions: { name: string } | null;
};

type TransformedData = {
  name: string;
  accounts: Omit<AccountWithInstitution, "Institutions">[];
};
/**
 * Transforms an array of accounts with institutions into grouped objects.
 *
 * @param dataArray - Array of accounts with institution info.
 * @returns Transformed data grouped by institution.
 */
function transformData(dataArray: AccountWithInstitution[]): TransformedData[] {
  const grouped = dataArray.reduce<Record<string, TransformedData>>(
    (acc, item) => {
      const institutionName = item.Institutions?.name || "Unknown Institution"; // Handle null case

      if (!acc[institutionName]) {
        acc[institutionName] = {
          name: institutionName,
          accounts: [],
        };
      }

      // Remove `Institutions` key before pushing
      const { Institutions, ...accountData } = item;
      acc[institutionName].accounts.push(accountData);

      return acc;
    },
    {}
  );

  return Object.values(grouped);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  let userData = await supabase.auth.getUser();

  if (!userData.data.user) {
    return NextResponse.json(
      {
        error: "Error getting user",
      },
      {
        status: 500,
      }
    );
  }

  const { institutionId } = await request.json();
  let query = supabase
    .from("Accounts")
    .select("*, Institutions(name)")
    .eq("user_id", userData.data.user.id);
  // If institution_id is given, select account associated with that id
  if (institutionId) {
    query = query.eq("ins_id", institutionId);
  }

  let { data, error } = await query;
  if (error) {
    return NextResponse.json(
      {
        error: "Error getting account info",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      accounts: data ? transformData(data as AccountWithInstitution[]) : [],
    },
    {
      status: 200,
    }
  );
}
