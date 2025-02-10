"use server";
import { createClient } from "../supabase/server";

export const fetchInstitutionByID = async (id: string) => {
  try {
    let supabase = await createClient();
    let res = await supabase
      .from("Institutions")
      .select("*")
      .eq("id", id)
      .single();
    // Return the name only for now
    return res.data || null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
