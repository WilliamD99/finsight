"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { FinancialHealthIndicatorSettingsSchema } from "@/utils/form/schema";

export async function updateFinancialHealthSettings(
  settings: FinancialHealthIndicatorSettingsSchema
) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Update settings in Supabase
    const { error } = await supabase
      .from("App Settings")
      .upsert({
        id: user.id,
        dashboard: {
          indicators: settings,
        },
      })
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
