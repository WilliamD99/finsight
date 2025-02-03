import { Tables } from "@/types/supabase"
import { createClient } from "@/utils/supabase/client"
import { UserResponse } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"

const supabase = createClient()

// Get auth data of current user
export const useUserAccount = () => {
    return useQuery<UserResponse["data"]>({
        queryKey: ["account"],
        queryFn: async (): Promise<UserResponse["data"]> => {
            const user = await supabase.auth.getUser()

            return user.data
        },
    })
}

// Get the profile based on id
export const useUserProfile = (id: string) => {
    return useQuery<Tables<"User Profile">>({
        queryKey: ["profile", id],
        queryFn: async (): Promise<Tables<"User Profile">> => {
            const res = await supabase.from("User Profile").select().eq("id", id)

            return res.data![0]
        }
    })
}
