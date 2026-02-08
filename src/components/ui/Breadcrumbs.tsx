import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex text-sm text-gray-500 ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center flex-wrap">
        <li className="inline-flex items-center">
          <Link to="/" className="hover:text-black transition-colors">
            Inicio
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            {item.path ? (
              <Link to={item.path} className="hover:text-black transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-black font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;