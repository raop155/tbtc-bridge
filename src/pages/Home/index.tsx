/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CHAIN_ID_ETH,
  CHAIN_ID_POLYGON,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_OPTIMISM,
} from '@certusone/wormhole-sdk';
import StepContainer from '@/components/StepContainer';
import { useState } from 'react';
import SourceStep from './SourceStep';
import TargetStep from './TargetStep';

import TransferStep from './TransferStep';
import RedeemStep from './RedeemStep';
import AllowanceStep from './AllowanceStep';
import AttestStep from './AttestStep';

const items = [
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
      <div className='w-[75%] max-w-[1440px] p-10 mx-auto flex-col '>
        <h3 className='mb-3 text-xl leading-relaxed text-center'>
          Bridge and send native tBTC between{' '}
          <span className='p-2 text-blue-800 bg-white rounded'>Ethereum</span> and
        </h3>
        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='p-2 bg-gray-500 rounded'>Polygon</div>
          <div className='p-2 bg-gray-500 rounded'>Arbitrum</div>
          <div className='p-2 bg-gray-500 rounded'>Optimism</div>
        </div>

        <div className='max-w-2xl mx-auto'>
          <StepContainer title='1. Source Chain' className='z-[60]'>
            <SourceStep
              sourceChains={sourceChains}
              selectedSourceChain={selectedSourceChain}
              setSelectedSourceChain={setSelectedSourceChain}
            />
          </StepContainer>

          <StepContainer title='2. Target Chain' className='z-[55]'>
            <TargetStep
              targetChains={targetChains}
              selectedTargetChain={selectedTargetChain}
              setSelectedTargetChain={setSelectedTargetChain}
            />
          </StepContainer>

          <StepContainer title='*. Attest Token'>
            <AttestStep />
          </StepContainer>

          <StepContainer title='*. Allowance'>
            <AllowanceStep />
          </StepContainer>

          <StepContainer title='3. Send Tokens'>
            <TransferStep />
          </StepContainer>

          <StepContainer title='4. Redeem Tokens'>
            <RedeemStep />
          </StepContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;
