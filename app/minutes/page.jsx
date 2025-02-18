import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import AddEditProfile from "../components/AddEditProfile";
import AddEditMinutes from "../components/AddEditMinutes";
import MinutesList from "./MinutesList";
import { cookies } from "next/headers";

export default async function Minutes() {
    const token = cookies().get('auth_token');

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
                    <h2 className="font-bold">Not authenticated</h2>
                </div>
            </div>
        );
    }

    const decodedToken = jwt.decode(token.value);

    if (!decodedToken || !decodedToken.user) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
                    <h2 className="font-bold">Invalid token</h2>
                </div>
            </div>
        );
    }

    const user = decodedToken.user;

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

    // Fetch minutes data based on organisation_id
    const { data: minutesData, error: minutesError } = await supabase
        .from('minutes')
        .select('*')
        .eq('organisation_id', profile.organisation_id);

    let minutes = [];
    if (minutesData) {
        minutes = minutesData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

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
                    <p>{profile?.organisation_id}</p>
                </div>
                <div className="flex items-end gap-4 mr-4">
                    <AddEditProfile profile={profile} />
                    <form action="/api/logout" method="post">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="submit">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
            <br />
            {minutes.length > 0 ? (
                <div>
                    
                    <AddEditMinutes minutes={minutes} organisation_id={profile.organisation_id} created_by={user.id} />
                    <MinutesList minutes={minutes} user={user} profile={profile} created_by={user.id} />
                </div>
            ) : (
                <div>No minutes available
                    <AddEditMinutes minutes={minutes} organisation_id={profile.organisation_id} created_by={user.id}/>
                </div>
            )}
        </div>
    );
}