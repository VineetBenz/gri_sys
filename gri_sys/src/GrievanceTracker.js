import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Import Supabase client

const GrievanceTracker = () => {
    const [trackingId, setTrackingId] = useState('');
    const [trackingHistory, setTrackingHistory] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [grievanceDetails, setGrievanceDetails] = useState(null);

    const fetchTrackingHistory = async (grievanceId) => {
        setErrorMessage('');
        try {
            const { data, error } = await supabase
                .from('grievance_tracking')
                .select('*')
                .eq('grievance_id', grievanceId)
                .order('time_of_action', { ascending: true });

            if (error) {
                throw new Error('Failed to fetch tracking history.');
            }

            setTrackingHistory(data);
        } catch (error) {
            console.error('Error fetching tracking history:', error.message);
            setErrorMessage(`Error: ${error.message}`);
        }
    };

    const fetchGrievanceDetails = async () => {
        setErrorMessage('');
        try {
            const { data, error } = await supabase
                .from('grievances')
                .select('*')
                .eq('id', trackingId)
                .single();

            if (error || !data) {
                throw new Error('Grievance not found.');
            }

            setGrievanceDetails(data);
            fetchTrackingHistory(data.id);
        } catch (error) {
            console.error('Error fetching grievance details:', error.message);
            setErrorMessage(`Error: ${error.message}`);
            setGrievanceDetails(null);
            setTrackingHistory([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (trackingId) {
            fetchGrievanceDetails();
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Grievance Tracker</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Enter Tracking ID:</label>
                    <input 
                        type="text" 
                        value={trackingId} 
                        onChange={(e) => setTrackingId(e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Track Grievance
                </button>
            </form>

            {errorMessage && (
                <div className="mt-6 text-center">
                    <h2 className="text-red-500 text-lg font-semibold">{errorMessage}</h2>
                </div>
            )}

            {grievanceDetails && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Grievance Details</h3>
                    <p><strong>Category:</strong> {grievanceDetails.category}</p>
                    <p><strong>Sub-Category:</strong> {grievanceDetails.sub_category}</p>
                    <p><strong>Description:</strong> {grievanceDetails.grievance_description}</p>
                    <p><strong>Submission Date:</strong> {new Date(grievanceDetails.submission_date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {grievanceDetails.location}</p>
                    <p><strong>Current Status:</strong> {grievanceDetails.current_status}</p>
                </div>
            )}

            {trackingHistory.length > 0 && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Tracking History</h3>
                    <ul className="space-y-4">
                        {trackingHistory.map((record) => (
                            <li key={record.id} className="border-b border-gray-200 pb-4">
                                <p><strong>Status:</strong> {record.status}</p>
                                <p><strong>Action Taken:</strong> {record.action_taken}</p>
                                <p><strong>Time of Action:</strong> {new Date(record.time_of_action).toLocaleString()}</p>
                                <p><strong>Remarks:</strong> {record.remarks}</p>
                                <p><strong>Estimated Resolution Time:</strong> {record.estimated_resolution_time}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {grievanceDetails && trackingHistory.length === 0 && (
                <p className="mt-6 text-center text-gray-600">No tracking history available for this grievance.</p>
            )}
        </div>
    );
};

export default GrievanceTracker;
