'use server';

import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addMinutes(formData){
    const title = formData.get('title');
    const content = formData.get('content');
    const organisation_id = formData.get('organisation_id');
    const created_by = formData.get('created_by');

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    if(!token){
        console.error('User is not authenticated within updateProfile server action');
        return
    }


    const { data, error } = await supabase
        .from('minutes')
        .insert(
            {
                title, 
                content, 
                organisation_id,
                created_by
            }
        )

    if (error) {
        console.error('Error updating profile', error);
        return;
    }

    revalidatePath('/minutes');

    return {message: 'Successfully updated profile'}
}