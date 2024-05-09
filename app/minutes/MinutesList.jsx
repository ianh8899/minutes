// MinutesList.jsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import AddEditMinutes from "../components/AddEditMinutes";

export default function MinutesList({ minutes, profile, created_by }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMinutes = minutes.filter(minute => 
        new RegExp(searchTerm, "i").test(minute.content)
    );

    return (
        <>
            <div className="flex justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search Content Field..."
                    className="w-1/2 px-5 py-3 mt-5 mb-5 text-center bg-white rounded-full focus:outline-double border-2 border-gray-300 focus:border-blue-500 focus:shadow-outline text-black"
                />
            </div>
            

            {filteredMinutes?.map(minute => (
                <div key={minute.id} className="bg-white shadow-2xl overflow-hidden sm:rounded-lg mb-4 mx-12">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{minute.title}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Created By - {minute.created_by}</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Content</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{minute.content}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Date</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{format(new Date(minute.created_at), 'dd/MM/yyyy')}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{format(new Date(minute.updated_at), 'dd/MM/yyyy')}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Organisation</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{minute.organization_id}</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <AddEditMinutes edit={true} minute={minute} organization_id={profile.organization_id} created_by={created_by}/>
                    </div>
                </div>
            ))}
        </>
    );
}