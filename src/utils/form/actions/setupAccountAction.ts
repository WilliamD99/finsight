"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { accountSetupFormSchema } from "../schema";
import { revalidatePath } from "next/cache";

export const setupAccountAction = async (
  type: "insert" | "update",
  formData: FormData
) => {
  const supabase = await createClient();

  const formObject = Object.fromEntries(formData.entries());

  try {
    // Validate the data sent from the client
    const data = accountSetupFormSchema.parse(formObject);
    const user = await supabase.auth.getUser();

    let message;

    // If the type is insert, new entry will be added
    if (type === "insert") {
      // Create an User profile row
      const { error } = await supabase.from("User Profile").insert({
        id: user.data.user?.id,
        email: user.data.user?.email,
        first_name: data.first_name,
        last_name: data.last_name,
      });

      if (error) redirect("/error");

      // After successfully insert, need to update the metadata of auth: hasSetup
      await supabase.auth.updateUser({
        data: {
          hasSetup: true,
        },
      });
      message = "Profile created!";
    } else if (type === "update") {
      // Update the user profile based on user's id
      const { error } = await supabase
        .from("User Profile")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
        })
        .eq("id", user.data.user!.id);
      if (error) redirect("/error");
      message = "Profile updated!";
    } else {
      redirect("/error");
    }

    // if (error) redirect("/error")
    // Remember to validate the profile page
    // revalidatePath("/profile", "page")
    return {
      status: 201,
      message,
    };
  } catch (e) {
    console.log(e);
    redirect("/error");
  }
};
