import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='min-h-[40px] bg-gray-800 w-full border-t border-gray-600 text-sm'>
      <div className='flex items-center justify-between px-10 min-h-inherit max-w-[1440px] mx-auto'>
        <div>
          Copyright <span className='text-blue-500'>&copy;</span> {year}
        </div>
        <div>
          Made with <span className='text-red-500'>&hearts;</span> by{' '}
          <span className='text-blue-500'>Ricardo Olarte</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
