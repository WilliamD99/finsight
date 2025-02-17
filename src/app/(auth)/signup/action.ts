"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Since email confirmmation is enabled for supabase
  // signup won't throw any errors if the email is duplicate
  // The workaround is that check that identities

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signUpRes, error: signUpError } = await supabase.auth.signUp({
    ...data,
    options: {
      data: {
        hasSetup: false,
      },
    },
  });

  if (signUpError) {
    return {
      status: signUpError.status,
      message: signUpError.message,
    };
  } else if (signUpRes.user?.identities?.length === 0) {
    return {
      status: 400,
      message: "User with that email is already registered",
    };
  }

  redirect("/signup/confirm");
}
