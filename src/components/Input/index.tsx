import React from 'react';

type Props = {
  type: string;
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
};

const Input = ({ type = 'text', id, name, placeholder, className, ...props }: Props) => {
  return (
    <input
      {...props}
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      className={`px-3 py-2 rounded-sm text-sm outline-none border-2 border-transparent focus:border-2 focus:border-blue-500 ${className}`}
    />
  );
};

export default Input;
