import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Get all the institutions or one by ID
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    let { id } = await request.json();

    let query = supabase
      .from("Access Token Table")
      .select("item_id, Institutions!inner(name)");

    if (id) {
      query = query.eq("item_id", id);
    }

    let { data } = await query;
    if (data) {
      const flattenedData = data.map(({ item_id, Institutions }) => ({
        item_id,
        name: Institutions?.name || null,
      }));

      return NextResponse.json(
        {
          institutions: flattenedData,
        },
        {
          status: 200,
        }
      );
    }
    return NextResponse.json(
      {
        error: "Something went wrong, please try again.",
      },
      {
        status: 500,
      }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: "Something went wrong, please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
