import Button from '@/components/Button';
import useAllowance from '@/hooks/useAllowance';
import { sourceWalletAtom } from '@/store/store';
import { parseUnits } from 'ethers/lib/utils.js';
import { useAtom } from 'jotai';
import { ethers } from 'ethers';

const AllowanceStep = () => {
  const [sourceWallet] = useAtom(sourceWalletAtom);
  const { WH_CHAIN_ID: sourceChainId, signer } = sourceWallet || {};
  const amount = 0.000001;
  const decimals = 18;
  const amountParsed = parseUnits(String(amount), decimals);
  const tokenAddress = '0x679874fBE6D4E7Cc54A59e315FF1eB266686a937'; //tBTC (ETH)
  // const tokenAddress = '0xB19693FEB013Bab65866dE0a845a9511064230cE'; // WBNB (ETH)

  const { sufficientAllowance, isAllowanceFetching, isApproveProcessing, approveAmount } =
    useAllowance(sourceChainId, tokenAddress, amountParsed.toBigInt() || undefined, false, signer);

  console.log({ sufficientAllowance, isAllowanceFetching, isApproveProcessing, approveAmount });

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
