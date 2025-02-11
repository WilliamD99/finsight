import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // If user verify their account, create an UserProfile record
      const userData = await supabase.auth.getUser();
      if (!userData.data.user) redirect("/error");
      const { data: insertProfileRes, error } = await supabase
        .from("User Profile")
        .insert({
          id: userData.data.user.id,
          email: userData.data.user.email,
        });

      // redirect user to specified redirect URL or root of app
      redirect("/dashboard");
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/error");
}
