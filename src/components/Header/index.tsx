import ThresholdIcon from '@/assets/icons/threshold.svg';

const Header = () => {
  return (
    <header className='min-h-[55px] bg-gray-800 fixed w-full top-0 border-b border-gray-600 text-base z-[99] '>
      <div className='flex items-center justify-between px-10 min-h-inherit max-w-[1440px] mx-auto'>
        <a href='/' className='text-4xl font-bold text-blue-500'>
          <div className='flex gap-4'>
            <img
              className='block'
              src={ThresholdIcon}
              alt='threshold-icon'
              width='42'
              height='42'
            />
            <h1 className='text-4xl font-semibold tracking-wider text-center text-blue-500'>
              tBTC Bridge
            </h1>
          </div>
        </a>
      </div>
    </header>
  );
};

export default Header;
