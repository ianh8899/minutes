'use server';

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateMinutes(formData){
    const id = formData.get('id');
    const title = formData.get('title');
    const content = formData.get('content');

    const cookieStore = cookies();
    const supabase = createServerComponentClient({cookies: () => cookieStore});
    const { data: { user } } = await supabase.auth.getUser();

    if(!user){
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