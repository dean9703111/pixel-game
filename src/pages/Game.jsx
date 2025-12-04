import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/api';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import BossAvatar from '../components/BossAvatar';

const Game = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchedRef = React.useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const loadQuestions = async () => {
            try {
                const count = import.meta.env.VITE_QUESTION_COUNT || 5;
                const data = await fetchQuestions(count);
                setQuestions(data);
            } catch (err) {
                setError('Failed to load questions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, []);

    const handleAnswer = (option) => {
        const currentQuestion = questions[currentIndex];
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: option
        }));

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Finish game
            // We pass the answers to the result page via state or context
            // Here we'll use navigation state
            navigate('/result', {
                state: {
                    answers: { ...answers, [currentQuestion.id]: option },
                    questions: questions
                }
            });
        }
    };

    if (loading) {
        return (
            <div className="game-page">
                <h2 style={{ color: '#fff' }}>LOADING...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="game-page">
                <PixelCard>
                    <h2 style={{ color: 'red' }}>ERROR</h2>
                    <p>{error}</p>
                    <PixelButton onClick={() => window.location.reload()}>RETRY</PixelButton>
                </PixelCard>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div className="game-page">NO QUESTIONS FOUND</div>;
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="game-page" style={{ width: '100%', maxWidth: '800px' }}>
            <div style={{ marginBottom: '20px', color: '#f0c029' }}>
                LEVEL {currentIndex + 1} / {questions.length}
            </div>

            {/* Progress Bar */}
            <div style={{
                width: '100%',
                height: '20px',
                border: '4px solid #fff',
                marginBottom: '20px',
                position: 'relative'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: '#f0c029',
                    transition: 'width 0.3s'
                }} />
            </div>

            <BossAvatar seed={`boss-${currentQuestion.id}`} />

            <PixelCard>
                <h3 className="readable-text" style={{ marginBottom: '30px', lineHeight: '1.6', fontSize: '20px' }}>
                    {currentQuestion.question}
                </h3>

                <div style={{ display: 'grid', gap: '15px' }}>
                    {currentQuestion.options.map((option, idx) => (
                        <PixelButton
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            className="secondary readable-text"
                            style={{ width: '100%', textAlign: 'left', fontSize: '18px', textTransform: 'none' }}
                        >
                            {option}
                        </PixelButton>
                    ))}
                </div>
            </PixelCard>
        </div>
    );
};

export default Game;
