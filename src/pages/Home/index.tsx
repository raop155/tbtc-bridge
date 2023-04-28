import ThresholdIcon from '@/assets/icons/threshold.svg';
import { balanceAtom, isWalletConnectedAtom } from '@/store/store';
import { useAtom } from 'jotai';

const Home = () => {
  const [walletBalance] = useAtom(balanceAtom);
  const [isWalletConnected] = useAtom(isWalletConnectedAtom);

  return (
    <div className='flex justify-center flex-1 h-full'>
      <div className='max-w-[1440px] p-10 mx-auto flex-col '>
        <div className='flex items-center justify-center gap-4 mb-6'>
          <img className='block' src={ThresholdIcon} alt='threshold-icon' width='42' height='42' />
          <h1 className='text-5xl font-semibold tracking-wider text-center text-blue-500'>
            tBTC Bridge
          </h1>
        </div>
        <h3 className='mb-4 text-center'>
          Bridge and send native tBTC between{' '}
          <span className='p-2 text-blue-800 bg-white rounded'>Ethereum</span> and
        </h3>
        <div className='flex gap-3 mb-4'>
          <div className='p-2 bg-gray-500 rounded'>Polygon</div>
          <div className='p-2 bg-gray-500 rounded'>Arbitrum</div>
          <div className='p-2 bg-gray-500 rounded'>Optimism</div>
          <div className='p-2 bg-gray-500 rounded'>Few other EVM chains</div>
        </div>
        {isWalletConnected && <div>Balance: {walletBalance}</div>}
      </div>
    </div>
  );
};

export default Home;
