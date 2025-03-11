import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const userData = await supabase.auth.getUser();

  if (!userData.data.user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("Accounts")
    .select("*")
    .eq("user_id", userData.data.user?.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
