'use server';

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addMinutes(formData){
    const title = formData.get('title');
    const content = formData.get('content');
    const organization_id = formData.get('organization_id');

    const cookieStore = cookies();
    const supabase = createServerComponentClient({cookies: () => cookieStore});
    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);

    if(!user){
        console.error('User is not authenticated within updateProfile server action');
        return
    }

    const { data, error } = await supabase
        .from('minutes')
        .insert(
            {
                title, 
                content, 
                organization_id,
                created_by: user.id,
            }
        )

    if (error) {
        console.error('Error updating profile', error);
        return;
    }

    revalidatePath('/minutes');

    return {message: 'Successfully updated profile'}
}