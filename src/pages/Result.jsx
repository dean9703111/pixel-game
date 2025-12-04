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

        // Create a unique session ID for this game attempt based on the first question ID and timestamp or just use a flag
        // A simple way is to use the state object itself as a key, but state changes on reload? No, state is preserved in history.
        // Let's use a combination of question IDs as a unique key for this "game"
        const gameId = state.questions.map(q => q.id).join('-');
        const sessionKey = `submitted_${gameId}`;

        if (sessionStorage.getItem(sessionKey)) {
            // Already submitted, maybe we should just redirect home or show an error?
            // Or better, if we saved the result in sessionStorage, we could show it?
            // For now, let's just redirect to home to prevent "re-rolling" or duplicate submission errors
            console.log('Already submitted this game session');
            navigate('/');
            return;
        }

        if (submittedRef.current) return;
        submittedRef.current = true;

        const submit = async () => {
            try {
                const userId = localStorage.getItem('pixel_game_user_id');
                const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || 3);

                const data = await submitScore(userId, state.answers, passThreshold);
                setResult(data);

                // Mark as submitted
                sessionStorage.setItem(sessionKey, 'true');
            } catch (error) {
                console.error(error);
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
            <div className="result-page" style={{ textAlign: 'center', width: '100%', maxWidth: '800px', paddingBottom: '40px' }}>
                <PixelCard>
                    <h2 style={{ marginBottom: '20px', color: '#f0c029' }}>REVIEW ANSWERS</h2>

                    <div style={{ textAlign: 'left', display: 'grid', gap: '15px' }}>
                        {result.details && result.details.map((detail, idx) => {
                            // Find original question text
                            const questionText = state.questions.find(q => q.id == detail.id)?.question || 'Unknown Question';
                            const isCorrect = detail.isCorrect;

                            return (
                                <div key={idx} className="readable-text" style={{
                                    border: `4px solid ${isCorrect ? '#4caf50' : '#f44336'}`,
                                    padding: '15px',
                                    background: '#fff',
                                    color: '#000',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        right: '10px',
                                        background: isCorrect ? '#4caf50' : '#f44336',
                                        color: '#fff',
                                        padding: '2px 8px',
                                        fontSize: '12px',
                                        fontFamily: 'var(--font-pixel)'
                                    }}>
                                        {isCorrect ? 'CORRECT' : 'WRONG'}
                                    </div>

                                    <div style={{ marginBottom: '10px', lineHeight: '1.4', fontWeight: 'bold', fontSize: '16px' }}>
                                        {idx + 1}. {questionText}
                                    </div>

                                    <div style={{ fontSize: '14px', display: 'grid', gap: '5px' }}>
                                        <div style={{
                                            color: isCorrect ? '#2e7d32' : '#d32f2f',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <span>YOURS:</span>
                                            <span style={{ fontWeight: 'bold' }}>{detail.userAnswer}</span>
                                        </div>

                                        {!isCorrect && (
                                            <div style={{
                                                color: '#2e7d32',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}>
                                                <span>RIGHT:</span>
                                                <span style={{ fontWeight: 'bold' }}>{detail.correctAnswer}</span>
                                            </div>
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
