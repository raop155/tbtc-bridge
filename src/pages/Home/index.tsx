/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CHAIN_ID_ETH,
  CHAIN_ID_POLYGON,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_OPTIMISM,
  CHAIN_ID_BSC,
} from '@certusone/wormhole-sdk';
import ThresholdIcon from '@/assets/icons/threshold.svg';
import StepContainer from '@/components/StepContainer';
import { useState } from 'react';
import SourceStep from './SourceStep';
import TargetStep from './TargetStep';

import TransferStep from './TransferStep';

const items = [
  { id: CHAIN_ID_BSC, name: 'Binance Smart Chain', disabled: false },
  { id: CHAIN_ID_ETH, name: 'Ethereum', disabled: false },
  { id: CHAIN_ID_POLYGON, name: 'Polygon', disabled: false },
  { id: CHAIN_ID_ARBITRUM, name: 'Arbitrum', disabled: false },
  { id: CHAIN_ID_OPTIMISM, name: 'Optimism', disabled: false },
];

const Home = () => {
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

        <StepContainer title='1. Source Chain' className='z-[50]'>
          <SourceStep
            sourceChains={sourceChains}
            selectedSourceChain={selectedSourceChain}
            setSelectedSourceChain={setSelectedSourceChain}
          />
        </StepContainer>

        <StepContainer title='2. Target Chain' className='z-[45]'>
          <TargetStep
            targetChains={targetChains}
            selectedTargetChain={selectedTargetChain}
            setSelectedTargetChain={setSelectedTargetChain}
          />
        </StepContainer>

        <StepContainer title='*. Attest Token'>
          <div className='w-full'>Attest Token & Create Token</div>
        </StepContainer>

        <StepContainer title='3. Send Tokens'>
          <TransferStep />
        </StepContainer>

        <StepContainer title='4. Redeem Tokens'>
          <div className='w-full'>Redeem Tokens</div>
        </StepContainer>
      </div>
    </div>
  );
};

export default Home;
