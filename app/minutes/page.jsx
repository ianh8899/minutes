import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import AddEditProfile from "../components/AddEditProfile";
import AddEditMinutes from "../components/AddEditMinutes";
import MinutesList from "./MinutesList";

export default async function Minutes(){
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('user_id', user?.id).single();
    const { data: minutesData, error: minutesError } = await supabase.from('minutes').select('*').eq('organization_id', profile?.organization_id);
    const minutes = minutesData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
                <div className="flex items-start gap-2 ml-4">
                    <h2 className="font-bold">Signed in as: </h2>
                    <p>{profile?.name}</p>
                    <p>{profile?.surname}</p>
                </div>
                <div className="flex items-center">
                    <h2 className="font-bold mr-2">In Organization: </h2>
                    <p>{profile?.organization_id}</p>
                </div>
                <div className="flex items-end gap-4 mr-4">
                    <AddEditProfile profile={profile} />
                    <form action="/auth/signout" method="post">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="submit">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
            <br />
            {minutesData.length > 0 ? (
                <div>
                    <AddEditMinutes organization_id={profile.organization_id} />
                    <MinutesList minutes={minutes} profile={profile} created_by={minutes.created_by} />
                </div>
            ) : (
                <>
                <div className="text-center mt-5">
                    <p>If you can't see any items, please update your profile.</p>
                </div>
                </>
            )}
        </div>
    )
}