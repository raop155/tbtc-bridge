/* eslint-disable @typescript-eslint/no-explicit-any */
import ThresholdIcon from '@/assets/icons/threshold.svg';
import Select from '@/components/Select';
import StepContainer from '@/components/StepContainer';
import { balanceAtom, isWalletConnectedAtom } from '@/store/store';
import { useAtom } from 'jotai';
import { useState } from 'react';

const items = [
  { id: 1, name: 'Ethereum', disabled: false },
  { id: 2, name: 'Polygon', disabled: false },
  { id: 3, name: 'Arbitrum', disabled: false },
  { id: 4, name: 'Optimism', disabled: false },
];

const Home = () => {
  const [walletBalance] = useAtom(balanceAtom);
  const [isWalletConnected] = useAtom(isWalletConnectedAtom);
  const [selectedSourceChain, setSelectedSourceChain] = useState<any>(items[0]);
  const [selectedTargetChain, setSelectedTargetChain] = useState<any>(items[1]);
  const sourceChains = items.filter((item) => item.id !== selectedTargetChain.id);
  const targetChains = items.filter((item) => item.id !== selectedSourceChain.id);

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

        <StepContainer title='1. Source Chain' className='z-[20]'>
          <div className='w-full '>
            <Select
              label='From'
              items={sourceChains}
              value={selectedSourceChain}
              setValue={setSelectedSourceChain}
            />
          </div>
        </StepContainer>

        <StepContainer title='2. Target Chain' className='z-[19]'>
          <div className='w-full'>
            <Select
              label='To'
              items={targetChains}
              value={selectedTargetChain}
              setValue={setSelectedTargetChain}
            />
          </div>
        </StepContainer>

        <StepContainer title='*. Attest Token'>
          <div className='w-full'>Attest Token & Create Token</div>
        </StepContainer>

        <StepContainer title='3. Send Tokens'>
          <div className='w-full'>Send Tokens</div>
        </StepContainer>

        <StepContainer title='4. Redeem Tokens'>
          <div className='w-full'>Redeem Tokens</div>
        </StepContainer>

        {isWalletConnected && <div>Balance: {walletBalance}</div>}
      </div>
    </div>
  );
};

export default Home;
