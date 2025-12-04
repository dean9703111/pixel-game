import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';

const Home = () => {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if (userId.trim()) {
            localStorage.setItem('pixel_game_user_id', userId);
            navigate('/game');
        }
    };

    return (
        <div className="home-page">
            <PixelCard className="text-center">
                <h1 style={{ color: '#f0c029', textShadow: '4px 4px #000', marginBottom: '40px' }}>
                    PIXEL QUIZ
                </h1>
                <p style={{ marginBottom: '30px' }}>ENTER YOUR ID TO START</p>

                <input
                    type="text"
                    placeholder="USER ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />

                <PixelButton onClick={handleStart} disabled={!userId.trim()}>
                    START GAME
                </PixelButton>
            </PixelCard>
        </div>
    );
};

export default Home;
