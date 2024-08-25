import React, { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@headlessui/react'; // Import Headless UI Button
import clsx from 'clsx'; // Import clsx for conditional classes

const VoiceInput = ({ setInput }) => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const listeningTimeoutRef = useRef(null);

    useEffect(() => {
        setInput(transcript); // Update input state whenever transcript changes
    }, [transcript, setInput]);

    const handleStartListening = () => {
        console.log("Attempting to start listening...");
        resetTranscript(); // Optional: Reset the transcript before starting a new session
        SpeechRecognition.startListening({ continuous: true });

        // Auto-stop after 7 seconds
        listeningTimeoutRef.current = setTimeout(() => {
            console.log("Auto-stopping listening...");
            SpeechRecognition.stopListening();
        }, 60000); // 7000 milliseconds = 7 seconds
    };

    const handleStopListening = () => {
        console.log("Stopping listening...");
        clearTimeout(listeningTimeoutRef.current); // Clear the timeout if manually stopping
        SpeechRecognition.stopListening();
    };

    useEffect(() => {
        return () => {
            clearTimeout(listeningTimeoutRef.current); // Clear timeout on unmount to avoid memory leaks
        };
    }, []);

    if (!browserSupportsSpeechRecognition) {
        return <p className="text-red-500">Your browser does not support speech recognition.</p>;
    }

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md space-y-4">
            <div className="flex space-x-2">
                <Button
                    onClick={handleStartListening}
                    disabled={listening}
                    className={clsx(
                        'px-4 py-2 font-semibold text-white rounded-lg',
                        listening ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    )}
                >
                    Start Listening
                </Button>
                <Button
                    onClick={handleStopListening}
                    disabled={!listening}
                    className={clsx(
                        'px-4 py-2 font-semibold text-white rounded-lg',
                        !listening ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                    )}
                >
                    Stop Listening
                </Button>
                <Button
                    onClick={resetTranscript}
                    className="px-4 py-2 font-semibold text-white bg-gray-500 hover:bg-gray-600 rounded-lg"
                >
                    Reset Transcript
                </Button>
            </div>
            <textarea
                value={transcript}
                readOnly
                className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none"
            />
            {listening && <p className="text-green-500">Listening...</p>}
        </div>
    );
};

export default VoiceInput;
