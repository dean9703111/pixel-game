import React from 'react';
import './PixelButton.css';

const PixelButton = ({ children, onClick, disabled, className = '', variant = 'primary' }) => {
  return (
    <button 
      className={`pixel-btn ${variant} ${className}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PixelButton;
