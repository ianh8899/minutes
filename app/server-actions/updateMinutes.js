'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateMinutes(formData){
    const id = formData.get('id');
    const title = formData.get('title');
    const content = formData.get('content');

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const token = cookies().get('auth_token');

    if(!token){
        console.error('User is not authenticated within updateProfile server action');
        return
    }

    const { data, error } = await supabase
        .from('minutes')
        .update(
            {
                title, 
                content, 
            }
        ).match(
            {id, id}
        )

    if (error) {
        console.error('Error updating profile', error);
        return;
    }

    revalidatePath('/minutes');

    return {message: 'Successfully updated profile'}
}