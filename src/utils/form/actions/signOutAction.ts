'use server'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function signOutAction() {
    let supabase = await createClient();
    let { error } = await supabase.auth.signOut();
    if (!error) redirect("/login");
    else redirect("/error");
};