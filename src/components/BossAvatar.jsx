import React, { useMemo } from 'react';

const BossAvatar = ({ seed, size = 150, style = {}, className = '' }) => {
    // Use DiceBear Pixel Art style
    // We can use 'pixel-art' or 'pixel-art-neutral'
    const avatarUrl = useMemo(() => {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&size=${size}`;
    }, [seed, size]);

    return (
        <div className={`boss-avatar ${className}`} style={{ textAlign: 'center', ...style }}>
            <img
                src={avatarUrl}
                alt="Boss"
                style={{
                    width: size,
                    height: size,
                    imageRendering: 'pixelated',
                    border: '4px solid #fff',
                    background: '#000'
                }}
            />
        </div>
    );
};

export default BossAvatar;
