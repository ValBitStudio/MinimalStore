import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon,
  children
}) => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center text-center p-8">
      {icon && (
        <div className="mb-6 text-gray-300 bg-gray-50 p-4 rounded-full">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-8 max-w-[240px] leading-relaxed">
          {description}
        </p>
      )}
      <button 
        onClick={onAction} 
        className="text-sm font-medium text-black border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-all"
      >
        {actionLabel}
      </button>
      {children && (
        <div className="mt-12 w-full text-left">{children}</div>
      )}
    </div>
  );
};

export default EmptyState;