'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error, data: test } = await supabase.auth.signInWithPassword(data)
    console.log(error, test, 'hahs')
    if (error) {
        return {
            message: error.message,
            status: error.status
        }
    }

    // revalidatePath('/', 'layout')
    redirect('/dashboard')
}
