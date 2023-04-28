import ThresholdIcon from '@/assets/icons/threshold.svg';
import Select from '@/components/Select';
import { balanceAtom, isWalletConnectedAtom } from '@/store/store';
import { useAtom } from 'jotai';

const items = [
  { id: 1, name: 'Ethereum', disabled: false },
  { id: 2, name: 'Polygon', disabled: false },
  { id: 3, name: 'Arbitrum', disabled: false },
  { id: 4, name: 'Optimism', disabled: false },
];

const Home = () => {
  const [walletBalance] = useAtom(balanceAtom);
  const [isWalletConnected] = useAtom(isWalletConnectedAtom);

  return (
    <div className='flex justify-center flex-1 h-full '>
      <div className='w-[65%] max-w-[1440px] p-10 mx-auto flex-col '>
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
        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='p-2 bg-gray-500 rounded'>Polygon</div>
          <div className='p-2 bg-gray-500 rounded'>Arbitrum</div>
          <div className='p-2 bg-gray-500 rounded'>Optimism</div>
          <div className='p-2 bg-gray-500 rounded'>Few other EVM chains</div>
        </div>

        <div className='flex gap-4 p-4 mb-4 border border-gray-500 rounded'>
          <div className='w-[50%]'>
            <Select label='From' items={items} />
          </div>

          <div className='w-[50%]'>
            <Select label='To' items={items} />
          </div>
        </div>

        {isWalletConnected && <div>Balance: {walletBalance}</div>}
      </div>
    </div>
  );
};

export default Home;
