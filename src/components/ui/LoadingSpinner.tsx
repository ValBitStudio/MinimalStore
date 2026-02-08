import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'black' | 'white' | 'gray';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'black',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    black: 'border-gray-200 border-t-black',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-100 border-t-gray-400',
  };

  return (
    <div 
      className={`inline-block ${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`} 
      role="status" 
      aria-label="Cargando"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default LoadingSpinner;