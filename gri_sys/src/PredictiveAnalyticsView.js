import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar
} from 'recharts';

const PredictiveAnalyticsView = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('grievances')
                .select('*');

            if (error) {
                console.error('Error fetching data:', error.message);
            } else {
                setGrievances(data);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center text-blue-500">Loading...</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Predictive Analytics</h1>
            <AnalyticsView grievances={grievances} />
        </div>
    );
};

const AnalyticsView = ({ grievances }) => {
    const analyzeGrievances = (grievances) => {
        const totalGrievances = grievances.length;
        const resolvedGrievances = grievances.filter(g => g.current_status === 'Resolved').length;
        const pendingGrievances = totalGrievances - resolvedGrievances;

        const categoryCounts = grievances.reduce((acc, grievance) => {
            const category = grievance.category;
            acc[category] = acc[category] ? acc[category] + 1 : 1;
            return acc;
        }, {});

        const categoryData = Object.keys(categoryCounts).map(category => ({
            name: category,
            grievances: categoryCounts[category],
        }));

        return {
            totalGrievances,
            resolvedGrievances,
            pendingGrievances,
            categoryData,
        };
    };

    const { totalGrievances, resolvedGrievances, pendingGrievances, categoryData } = analyzeGrievances(grievances);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800">Analytics Summary</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li>Total Grievances: <span className="font-bold">{totalGrievances}</span></li>
                <li>Resolved Grievances: <span className="font-bold text-green-600">{resolvedGrievances}</span></li>
                <li>Pending Grievances: <span className="font-bold text-red-600">{pendingGrievances}</span></li>
            </ul>

            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Grievances by Category</h3>
                <BarChart
                    width={600}
                    height={300}
                    data={categoryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="grievances" fill="#8884d8" />
                </BarChart>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Grievance Resolution Trends</h3>
                <LineChart
                    width={600}
                    height={300}
                    data={grievances.map(g => ({
                        submission_date: g.submission_date,
                        current_status: g.current_status,
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="submission_date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="current_status" stroke="#82ca9d" />
                </LineChart>
            </div>
        </div>
    );
};

export default PredictiveAnalyticsView;
