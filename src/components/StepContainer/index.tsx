import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const StepContainer = ({ title, className, children }: Props) => {
  return (
    <div
      className={`relative z-auto flex gap-4 p-4 mb-4 border border-gray-500 rounded ${className}`}
    >
      <label className='absolute top-0 left-0 px-2 text-sm text-blue-400 translate-x-3 -translate-y-1/2 bg-gray-900 rounded '>
        {title}
      </label>
      {children}
    </div>
  );
};

export default StepContainer;
