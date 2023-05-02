import React from 'react';

type Props = {
  text: React.ReactNode | string;
  onClick?: () => void;
  style?: 'purple' | 'default';
  className?: string;
};

const Button = ({ text, onClick, className, style = 'default', ...props }: Props) => {
  const styles = {
    default: `inline-block px-4 py-2 text-lg bg-blue-500 rounded-md hover:text-blue-500 hover:bg-white ${className}`,
    purple: `inline-block px-4 py-2 text-lg bg-purple-500 rounded-md hover:text-purple-500 hover:bg-white ${className}`,
  };
  return (
    <button
      {...props}
      onClick={onClick}
      className={styles[style]}
      style={{ letterSpacing: 'inherit' }}
    >
      {text}
    </button>
  );
};

export default Button;
