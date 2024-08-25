import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import Supabase client

const GrievanceForm = ({ initialData }) => {
    const [formData, setFormData] = useState({
        Category: '',
        'Sub-Category': '',
        'Grievance Description': '',
        'Submission Date': '',
        Location: '',
        'User Demographics': '',
        'Initial Response Date': '',
        'Assigned Department': '',
        'Current Status': '',
        'Resolution Date': '',
        'Response Actions': ''
    });

    const [loading, setLoading] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setConfirmationMessage('');

        // Prepare the data for insertion
        const dataToInsert = {
            category: formData.Category,
            sub_category: formData['Sub-Category'],
            grievance_description: formData['Grievance Description'],
            submission_date: formData['Submission Date'] || null, // Set null if empty
            location: formData.Location,
            user_demographics: formData['User Demographics'],
            initial_response_date: formData['Initial Response Date'] || null, // Set null if empty
            assigned_department: formData['Assigned Department'],
            current_status: formData['Current Status'],
            resolution_date: formData['Resolution Date'] || null, // Set null if empty
            response_actions: formData['Response Actions']
        };

        try {
            // Insert a new record into the 'grievances' table
            const { data, error } = await supabase
                .from('grievances')
                .insert([dataToInsert])
                .select(); // Ensure we select the inserted data

            if (error) {
                // Display error message from Supabase
                throw new Error(error.message);
            }

            if (data && data.length > 0) {
                const grievanceId = data[0]?.id;
                if (grievanceId) {
                    setConfirmationMessage(`Grievance submitted successfully! Your tracking ID is ${grievanceId}`);
                } else {
                    throw new Error('Failed to retrieve the ID of the newly inserted record.');
                }
            } else {
                throw new Error('No data returned from the insert operation.');
            }

            // Reset the form data
            setFormData({
                Category: '',
                'Sub-Category': '',
                'Grievance Description': '',
                'Submission Date': '',
                Location: '',
                'User Demographics': '',
                'Initial Response Date': '',
                'Assigned Department': '',
                'Current Status': '',
                'Resolution Date': '',
                'Response Actions': ''
            });
        } catch (error) {
            console.error('Error submitting data:', error.message);
            setErrorMessage(`Failed to submit grievance. Error: ${error.message}`);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Grievance Details</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category:</label>
                    <input 
                        type="text" 
                        name="Category" 
                        value={formData.Category || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sub-Category:</label>
                    <input 
                        type="text" 
                        name="Sub-Category" 
                        value={formData['Sub-Category'] || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Grievance Description:</label>
                    <textarea 
                        name="Grievance Description" 
                        value={formData['Grievance Description'] || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Submission Date:</label>
                    <input 
                        type="date" 
                        name="Submission Date" 
                        value={formData['Submission Date'] || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location:</label>
                    <input 
                        type="text" 
                        name="Location" 
                        value={formData.Location || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">User Demographics:</label>
                    <input 
                        type="text" 
                        name="User Demographics" 
                        value={formData['User Demographics'] || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Initial Response Date:</label>
                    <input 
                        type="date" 
                        name="Initial Response Date" 
                        value={formData['Initial Response Date'] || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned Department:</label>
                    <input 
                        type="text" 
                        name="Assigned Department" 
                        value={formData['Assigned Department'] || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Status:</label>
                    <input 
                        type="text" 
                        name="Current Status" 
                        value={formData['Current Status'] || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Resolution Date:</label>
                    <input 
                        type="date" 
                        name="Resolution Date" 
                        value={formData['Resolution Date'] || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Response Actions:</label>
                    <input 
                        type="text" 
                        name="Response Actions" 
                        value={formData['Response Actions'] || ''} 
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-2 px-4 mt-4 text-white font-bold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            {confirmationMessage && <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md"><h2>{confirmationMessage}</h2></div>}
            {errorMessage && <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md"><h2>{errorMessage}</h2></div>}
        </div>
    );
};

export default GrievanceForm;
