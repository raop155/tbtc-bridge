import Button from '@/components/Button';
import useAllowance from '@/hooks/useAllowance';
import { sourceWalletAtom } from '@/store/store';
import { parseUnits } from 'ethers/lib/utils.js';
import { useAtom } from 'jotai';
import { ethers } from 'ethers';
import { THRESHOLD_TBTC_CONTRACTS } from '@/consts';
import { CHAIN_ID_ETH } from '@xlabs-libs/wallet-aggregator-core';

const AllowanceStep = () => {
  const [sourceWallet] = useAtom(sourceWalletAtom);
  const { WH_CHAIN_ID: sourceChainId, signer } = sourceWallet || {};
  const useThreshold = Boolean(sourceChainId !== CHAIN_ID_ETH);
  const amount = useThreshold ? 0.000015 : 0.000001;
  const decimals = 18;
  const amountParsed = parseUnits(String(amount), decimals);
  const tokenAddress = THRESHOLD_TBTC_CONTRACTS[sourceChainId];

  const { approveAmount } = useAllowance(
    sourceChainId,
    tokenAddress,
    amountParsed.toBigInt() || undefined,
    false,
    signer,
    useThreshold,
  );

  const startApproveAllowance = async () => {
    console.log('startApproveAllowance');
    approveAmount(ethers.constants.MaxUint256.toBigInt()).then(
      () => {
        console.log('startApproveAllowance Complete!');
      },
      (error) => console.log('Failed to approve the token transfer.', error),
    );
  };

  return (
    <div className='w-full'>
      <Button
        text='Approve {Unlimited} Allowance'
        className='w-full'
        onClick={startApproveAllowance}
      />
    </div>
  );
};

export default AllowanceStep;
