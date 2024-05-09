'use server';

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addProfile(formData){
    const id = formData.get('id');
    const name = formData.get('name');
    const surname = formData.get('surname');
    const organization_id = formData.get('organization_id');

    const cookieStore = cookies();
    const supabase = createServerComponentClient({cookies: () => cookieStore});
    const { data: { user } } = await supabase.auth.getUser();

    if(!user){
        console.error('User is not authenticated within updateProfile server action');
        return
    }

    const { data, error } = await supabase
        .from('profiles')
        .insert(
            {
                name, 
                surname, 
                organization_id,
                user_id: user.id,
            }
        )

    if (error) {
        console.error('Error updating profile', error);
        return;
    }

    revalidatePath('/minutes');

    return {message: 'Successfully updated profile'}
}