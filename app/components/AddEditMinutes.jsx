'use client';

import { useState, useEffect } from 'react';
import { addMinutes } from '../server-actions/addMinutes';
import { updateMinutes } from '../server-actions/updateMinutes';

export default function AddEditMinutes ({minute, organisation_id, created_by, edit}){
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: minute?.id || '',
        title: minute?.title || '',
        content: minute?.content || '',
        organisation_id: organisation_id,
        created_by: created_by
    });

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            organisation_id: organisation_id,
            created_by: created_by
        }));
    }, [organisation_id, created_by]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const formAction = edit ? updateMinutes : addMinutes;

    return (
        <div>
            <div className='flex justify-center'>
                <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {edit ? 'Update Minutes' : 'Add New Minutes'}
                </button>
            </div>
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-gray-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                            <div className="bg-gray-700 p-4 rounded max-w-md mx-auto mb-8">
                                <form action={formAction} onSubmit={() => setShowModal(false)}>
                                    <input type="hidden" name="id" value={formData.id} />
                                    <input type="hidden" name="organisation_id" value={organisation_id} />
                                    <input type="hidden" name="created_by" value={created_by} />
                                    <div className="mb-4">
                                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor='brand'>Title</label>
                                        <input 
                                            type="text"
                                            name="title"
                                            id="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor='model'>Content</label>
                                        <textarea 
                                            name="content"
                                            id="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                                            required
                                        />
                                    </div>
                                    <div className='flex justify-between'>
                                    <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{minute?.title ? 'Update Minutes' : 'Add Minutes'}</button>
                                    <button onClick={() => setShowModal(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-32">Close</button>
                                    </div>
                                </form>
                                
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}