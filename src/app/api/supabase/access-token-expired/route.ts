// This route is used to update the Access Token record to include the expired_at field

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { id, expired_at } = await request.json();
  const supabase = await createClient();

  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("Access Token Table")
    .update({
      expired_at: expired_at,
    })
    .eq("item_id", id)
    .eq("user_id", user.data.user.id)
    .select();
  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}
