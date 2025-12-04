import axios from 'axios';

const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// Mock data for development if API_URL is not set or if we want to test without backend
const MOCK_QUESTIONS = [
    { id: '1', question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'] },
    { id: '2', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'] },
    { id: '3', question: 'What is 2 + 2?', options: ['3', '4', '5', '6'] },
    { id: '4', question: 'Who wrote Hamlet?', options: ['Shakespeare', 'Dickens', 'Twain', 'Austen'] },
    { id: '5', question: 'What is the chemical symbol for Gold?', options: ['Ag', 'Au', 'Fe', 'Cu'] },
];

export const fetchQuestions = async (count = 5) => {
    if (!API_URL || API_URL.includes('YOUR_GOOGLE_SCRIPT_URL_HERE')) {
        console.warn('Using MOCK data. Please set VITE_GOOGLE_APP_SCRIPT_URL in .env');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return MOCK_QUESTIONS.slice(0, count);
    }

    try {
        const response = await axios.get(`${API_URL}?count=${count}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

export const submitScore = async (userId, answers, passThreshold) => {
    if (!API_URL || API_URL.includes('YOUR_GOOGLE_SCRIPT_URL_HERE')) {
        console.warn('Using MOCK submit. Data not saved.');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Calculate mock score
        let score = 0;
        // Mock answers: 1: Paris, 2: Mars, 3: 4, 4: Shakespeare, 5: Au
        // This is just a rough mock, real validation is on backend
        return {
            score: 50, // Mock score
            correctCount: 5,
            totalQuestions: Object.keys(answers).length,
            details: Object.keys(answers).map(id => ({
                id,
                userAnswer: answers[id],
                correctAnswer: answers[id], // Mocking all correct
                isCorrect: true
            }))
        };
    }

    try {
        // We need to send as plain text or ensure CORS is handled. 
        // GAS Web App usually requires 'no-cors' or specific handling if not published correctly.
        // However, axios post might trigger preflight. 
        // Standard way for GAS is often using fetch with specific mode or ensuring GAS handles OPTIONS.
        // For simplicity with axios, we send JSON string as body.

        // Note: GAS doPost often has issues with CORS. 
        // A common workaround is `Content-Type: text/plain;charset=utf-8` to avoid preflight, 
        // and parsing JSON in GAS.
        const response = await axios.post(API_URL, JSON.stringify({ userId, answers, passThreshold }), {
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting score:', error);
        throw error;
    }
};
