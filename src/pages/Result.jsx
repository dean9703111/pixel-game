import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitScore } from '../services/api';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    const submittedRef = React.useRef(false);

    useEffect(() => {
        if (!state || !state.answers) {
            navigate('/');
            return;
        }

        if (submittedRef.current) return;
        submittedRef.current = true;

        const submit = async () => {
            try {
                const userId = localStorage.getItem('pixel_game_user_id');
                // Calculate passed status here
                const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || 3);
                // We need to count correct answers before submitting to know if passed
                // But wait, we don't know which are correct until backend tells us?
                // Actually, backend calculates score. 
                // So we can't know if passed BEFORE submitting unless we validate locally.
                // But `code.gs` returns `correctCount`. 
                // So we should let backend calculate score, return it, AND THEN we might need to update "First Clear"?
                // No, that would require two requests.
                // Better approach: Send the threshold to the backend.

                const data = await submitScore(userId, state.answers, passThreshold);
                setResult(data);
            } catch (error) {
                console.error(error);
                // Reset if error allows retry? No, usually we just show error.
            } finally {
                setLoading(false);
            }
        };

        submit();
    }, [state, navigate]);

    const handleRetry = () => {
        navigate('/game');
    };

    const handleHome = () => {
        navigate('/');
    };

    const [showReview, setShowReview] = useState(false);

    if (loading) {
        return <h2 style={{ color: '#fff' }}>CALCULATING SCORE...</h2>;
    }

    if (!result) {
        return (
            <PixelCard>
                <h2>ERROR SUBMITTING SCORE</h2>
                <PixelButton onClick={handleHome}>HOME</PixelButton>
            </PixelCard>
        );
    }

    const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || 3);
    const passed = result.correctCount >= passThreshold;

    if (showReview) {
        return (
            <div className="result-page" style={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
                <PixelCard>
                    <h2 style={{ marginBottom: '30px', color: '#f0c029' }}>REVIEW ANSWERS</h2>

                    <div style={{ textAlign: 'left', display: 'grid', gap: '20px' }}>
                        {result.details && result.details.map((detail, idx) => {
                            // Find original question text
                            const questionText = state.questions.find(q => q.id == detail.id)?.question || 'Unknown Question';

                            return (
                                <div key={idx} className="readable-text" style={{
                                    border: '4px solid #fff',
                                    padding: '15px',
                                    background: detail.isCorrect ? '#2e7d32' : '#c62828'
                                }}>
                                    <div style={{ marginBottom: '10px', lineHeight: '1.4', fontWeight: 'bold' }}>
                                        {idx + 1}. {questionText}
                                    </div>
                                    <div style={{ fontSize: '16px', color: '#f0f0f0' }}>
                                        YOUR ANSWER: {detail.userAnswer}
                                        {!detail.isCorrect && (
                                            <span style={{ display: 'block', color: '#fff', marginTop: '5px', fontWeight: 'bold' }}>
                                                CORRECT: {detail.correctAnswer}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <PixelButton onClick={() => setShowReview(false)}>BACK</PixelButton>
                    </div>
                </PixelCard>
            </div>
        );
    }

    return (
        <div className="result-page" style={{ textAlign: 'center' }}>
            <PixelCard>
                <h1 style={{
                    color: passed ? '#4caf50' : '#f44336',
                    marginBottom: '20px',
                    textShadow: '2px 2px #000'
                }}>
                    {passed ? 'MISSION COMPLETE' : 'GAME OVER'}
                </h1>

                <div style={{ fontSize: '24px', marginBottom: '30px' }}>
                    SCORE: {result.score}
                </div>

                <div style={{ marginBottom: '40px' }}>
                    CORRECT: {result.correctCount} / {result.totalQuestions}
                </div>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <PixelButton onClick={handleRetry}>TRY AGAIN</PixelButton>
                    {result.details && (
                        <PixelButton onClick={() => setShowReview(true)} className="secondary">REVIEW</PixelButton>
                    )}
                    <PixelButton onClick={handleHome} className="secondary">HOME</PixelButton>
                </div>
            </PixelCard>
        </div>
    );
};

export default Result;
