import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Import Supabase client

const GrievanceActionLogger = () => {
    const [grievanceId, setGrievanceId] = useState('');
    const [intervalUnit, setIntervalUnit] = useState('hours'); // 'hours', 'days', etc.
    const [actionDetails, setActionDetails] = useState({
        status: '',
        action_taken: '',
        remarks: '',
        time_of_action: '',
        estimated_resolution_time: '', // Store the interval as a string
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setActionDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleIntervalChange = (e) => {
        const { value } = e.target;
        const interval = `${value} ${intervalUnit}`;
        setActionDetails(prevDetails => ({ ...prevDetails, estimated_resolution_time: interval }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setConfirmationMessage('');
        setErrorMessage('');

        try {
            const { data, error } = await supabase
                .from('grievance_tracking')
                .insert([{
                    grievance_id: grievanceId, // Associate action with the grievance ID
                    status: actionDetails.status,
                    action_taken: actionDetails.action_taken,
                    remarks: actionDetails.remarks,
                    time_of_action: actionDetails.time_of_action,
                    estimated_resolution_time: actionDetails.estimated_resolution_time // Insert as interval string
                }]);

            if (error) {
                throw new Error(error.message);
            }

            setConfirmationMessage(`Action logged successfully for Grievance ID: ${grievanceId}`);
            setActionDetails({
                status: '',
                action_taken: '',
                remarks: '',
                time_of_action: '',
                estimated_resolution_time: '',
            });
            setGrievanceId('');
        } catch (error) {
            console.error('Error logging action:', error.message);
            setErrorMessage(`Failed to log action. Error: ${error.message}`);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Log Grievance Action</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Grievance ID:</label>
                    <input 
                        type="text" 
                        name="grievance_id" 
                        value={grievanceId} 
                        onChange={(e) => setGrievanceId(e.target.value)} 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Status:</label>
                    <input 
                        type="text" 
                        name="status" 
                        value={actionDetails.status} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Action Taken:</label>
                    <textarea 
                        name="action_taken" 
                        value={actionDetails.action_taken} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Remarks:</label>
                    <textarea 
                        name="remarks" 
                        value={actionDetails.remarks} 
                        onChange={handleInputChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Time of Action:</label>
                    <input 
                        type="datetime-local" 
                        name="time_of_action" 
                        value={actionDetails.time_of_action} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Estimated Resolution Time (Interval):</label>
                    <div className="flex items-center space-x-2">
                        <input 
                            type="number" 
                            name="estimated_resolution_time" 
                            onChange={handleIntervalChange} 
                            placeholder="Enter number"
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <select 
                            onChange={(e) => setIntervalUnit(e.target.value)}
                            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                        </select>
                    </div>
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Log Action
                </button>
            </form>
            
            {confirmationMessage && (
                <div className="mt-6 text-center text-green-600">
                    <h2>{confirmationMessage}</h2>
                </div>
            )}
            {errorMessage && (
                <div className="mt-6 text-center text-red-600">
                    <h2>{errorMessage}</h2>
                </div>
            )}
        </div>
    );
};

export default GrievanceActionLogger;
