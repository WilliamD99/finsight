'use server'

import { User } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";

export async function getUserData(): Promise<User | null> {
    try {
        const supabase = await createClient()
        const user = await supabase.auth.getUser()
        let userData = user.data.user

        return userData;
    } catch (error) {
        console.log(error)
        return null
    }
}
