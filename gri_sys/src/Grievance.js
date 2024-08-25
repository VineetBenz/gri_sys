import React, { useState } from 'react';
import axios from 'axios';
import GrievanceForm from './GrievanceForm'; // Import the GrievanceForm component
import VoiceInput from './VoiceInput'; // Import the VoiceInput component
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion } from 'framer-motion'; // Import framer-motion for animations
import { Tooltip } from 'react-tooltip'; // Import Tooltip from react-tooltip

const Grievance = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { resetTranscript } = useSpeechRecognition();

    const validateForm = () => {
        const newErrors = {};
        if (!input) newErrors.input = "Grievance description is required.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/predict', { text: input });
            let result = response.data.response;

            // Slice 7 characters from the front and 3 characters from the end
            if (result.length > 10) {
                result = result.slice(7, -3);
            }

            // Parse JSON output
            const parsedResult = JSON.parse(result);
            setOutput(parsedResult);
        } catch (error) {
            console.error("Prediction error:", error.response ? error.response.data : error.message);
            setErrors((prev) => ({ ...prev, prediction: "Failed to make predictions." }));
        }
        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Grievance Handler</h1>
            {!output ? (
                <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold text-gray-700 mb-3">Grievance Description:</label>
                        <div className="relative">
                            <textarea 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)}
                                rows={6} 
                                className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                                placeholder="Describe your grievance here..."
                                data-tip="Provide a detailed description of your grievance here."
                            />
                            <VoiceInput setInput={setInput} resetTranscript={resetTranscript} />
                            <Tooltip id="text-area-tooltip" />
                        </div>
                        {errors.input && <span className="text-red-500 text-sm mt-2">{errors.input}</span>}
                    </div>
                    
                    <motion.button 
                        type="submit" 
                        disabled={loading} 
                        className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition duration-300 ease-in-out`}
                        whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                        whileTap={{ scale: 0.95 }}
                        data-tip={loading ? "Analyzing your grievance..." : "Submit your grievance"}
                    >
                        {loading ? 'Analyzing...' : 'Submit Grievance'}
                    </motion.button>

                    <Tooltip id="button-tooltip" />
                </motion.form>
            ) : (
                <GrievanceForm initialData={output} />
            )}
        </div>
    );
};

export default Grievance;
