'use server';

import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addProfile(formData){
    const id = formData.get('id');
    const name = formData.get('name');
    const surname = formData.get('surname');
    const organisation_id = formData.get('organisation_id');

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const token = cookies().get('auth_token');
    const decodedToken = jwt.decode(token.value);
    const user = decodedToken.user;

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
                organisation_id,
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