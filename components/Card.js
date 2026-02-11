'use client';

const Card = ({ children, className = "", glow = false }) => {
  return (
    <div className={`glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${glow ? 'glow-pulse' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
