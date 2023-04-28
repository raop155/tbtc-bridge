import NextLink from 'next/link';
import React from 'react';

type Props = {
  text: React.ReactNode | string;
  href: string;
  className?: string;
  as?: 'link' | 'button';
};

const styles = {
  link: 'inline-block hover:text-blue-500 underline underline-offset-4',
  button: 'inline-block px-8 py-3 text-lg bg-blue-500 rounded-md',
};

const Link = ({ text, href, className, as = 'link', ...props }: Props) => {
  return (
    <NextLink {...props} href={href} className={`${styles[as]} ${className}`}>
      <div className='flex items-center gap-1 w-fit'>{text}</div>
    </NextLink>
  );
};

export default Link;
