import React from 'react';

const StarBorder = ({ 
  children, 
  as = "div", 
  className = "", 
  color = "cyan", 
  speed = "5s",
  ...props 
}) => {
  const Component = as;
  
  const colorMap = {
    cyan: '#00ffff',
    blue: '#0066ff',
    purple: '#8a2be2',
    pink: '#ff1493',
    green: '#00ff00',
    orange: '#ff8c00',
    red: '#ff0000',
    white: '#ffffff'
  };

  const borderColor = colorMap[color] || color;

  return (
    <Component
      className={`relative overflow-hidden ${className}`}
      style={{
        '--star-color': borderColor,
        '--animation-speed': speed
      }}
      {...props}
    >
      {/* Animated star border */}
      <div className="absolute inset-0 star-border-animation"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;