import React from 'react';

type Props = {
  text: React.ReactNode | string;
  onClick?: () => void;
  className?: string;
};

const Button = ({ text, onClick, className, ...props }: Props) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className={`inline-block px-4 py-2 text-lg bg-blue-500 rounded-md hover:text-blue-500 hover:bg-white ${className}`}
      style={{ letterSpacing: 'inherit' }}
    >
      {text}
    </button>
  );
};

export default Button;
