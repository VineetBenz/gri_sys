import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { supabase } from './supabaseClient'; // Import Supabase client

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GrievanceStats = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [grievanceId, setGrievanceId] = useState('');
    const [grievanceDetails, setGrievanceDetails] = useState(null);

    useEffect(() => {
        const fetchGrievanceData = async () => {
            try {
                const { data, error } = await supabase
                    .from('grievances')
                    .select('category, count(*)')
                    .group('category');
                
                if (error) throw new Error(error.message);

                if (data && Array.isArray(data) && data.length > 0) {
                    const categories = data.map(item => item.category || 'Unknown');
                    const counts = data.map(item => item.count || 0);

                    setChartData({
                        labels: categories,
                        datasets: [
                            {
                                label: 'Number of Grievances by Category',
                                data: counts,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    });
                } else {
                    setChartData({
                        labels: ['No Data'],
                        datasets: [
                            {
                                label: 'Number of Grievances by Category',
                                data: [0],
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    });
                }
            } catch (error) {
                setError(`Error fetching data: ${error.message}`);
            }
            setLoading(false);
        };

        fetchGrievanceData();
    }, []);

    const fetchGrievanceDetails = async (id) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('grievances')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw new Error(error.message);

            setGrievanceDetails(data);
        } catch (error) {
            setError(`Error fetching grievance details: ${error.message}`);
        }
        setLoading(false);
    };

    const handleSearch = () => {
        if (grievanceId) {
            fetchGrievanceDetails(grievanceId);
        } else {
            setError('Please enter a grievance ID.');
        }
    };

    if (loading && !grievanceDetails) return <div className="text-center text-gray-500">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Grievance Statistics</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-3xl mx-auto">
                <Bar 
                    data={chartData} 
                    options={{ 
                        responsive: true, 
                        plugins: { 
                            legend: { position: 'top' }, 
                            title: { display: true, text: 'Grievance Statistics' } 
                        } 
                    }} 
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4">Search Grievance Details</h3>
                <input 
                    type="text" 
                    placeholder="Enter grievance ID" 
                    value={grievanceId} 
                    onChange={(e) => setGrievanceId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                />
                <button 
                    onClick={handleSearch}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Search
                </button>

                {grievanceDetails && (
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-2">Grievance Details</h4>
                        <pre className="bg-gray-200 p-4 rounded-lg overflow-x-auto">{JSON.stringify(grievanceDetails, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GrievanceStats;
