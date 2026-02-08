// c:\Users\JRV\Desktop\e-commerce\src\components\ui\Skeleton.tsx
import React from 'react';

// Componente reutilizable para estados de carga (Skeleton Loader)
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
