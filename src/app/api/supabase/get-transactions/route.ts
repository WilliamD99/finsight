import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentDate, getDateNDaysBefore } from "@/utils/data";
import { Tables } from "@/types/supabase";

export async function POST(request: NextRequest) {
  const { id, range } = await request.json();

  try {
    const supabase = await createClient();

    let currentDate = getCurrentDate();
    let startDate = getDateNDaysBefore(currentDate, parseInt(range));

    let query = supabase
      .from("Transactions")
      .select("*")
      .lte("date", currentDate)
      .gte("date", startDate);

    if (id) {
      query = query.eq("access_id", id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch transactions" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        transactions: data,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: "Error getting transactions",
      },
      {
        status: 500,
      }
    );
  }
}
