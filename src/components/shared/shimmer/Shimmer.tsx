import React from 'react';

interface ShimmerProps {
  className?: string; // Additional classes for the wrapper
  elements: {
    width?: string; // Tailwind width classes, e.g., w-full, w-3/4
    height?: string; // Tailwind height classes, e.g., h-4, h-16
    rounded?: string; // Tailwind rounding, e.g., rounded, rounded-xl
    className?: string; // Additional class for the element
  }[];
  animate?: boolean; // Enable/disable pulse animation
}

const Shimmer: React.FC<ShimmerProps> = ({ className = '', elements, animate = true }) => {
  return (
    <div className={`${animate ? 'animate-pulse' : ''} ${className}`}>
      {elements.map((el, idx) => (
        <div
          key={idx}
          className={`bg-gray-200 ${el.width ?? 'w-full'} ${el.height ?? 'h-4'} ${el.rounded ?? 'rounded'} ${el.className ?? ''} mb-2`}
        ></div>
      ))}
    </div>
  );
};

export default Shimmer;
