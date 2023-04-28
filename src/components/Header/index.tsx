import { useEffect, useState } from 'react';
import ThresholdIcon from '@/assets/icons/threshold.svg';
import Button from '@/components/Button';
import { useChangeWallet, useWalletsForChain } from '@xlabs-libs/wallet-aggregator-react';
import { CHAIN_ID_ETH } from '@xlabs-libs/wallet-aggregator-core';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { useAtom } from 'jotai';
import { balanceAtom, isWalletConnectedAtom } from '@/store/store';

const Header = () => {
  const changeWallet = useChangeWallet();
  const { wallet, evmChainId } = useEVMWallet(CHAIN_ID_ETH);

  const [isWalletConnected, setIsWalletConnected] = useAtom(isWalletConnectedAtom);
  const [, setWalletBalance] = useAtom(balanceAtom);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);

  const walletsForChain = useWalletsForChain(CHAIN_ID_ETH);
  const croppedAddress = `${walletAddress?.slice(0, 5)}...${walletAddress?.slice(-4)}`;

  useEffect(() => {
    if (!wallet || !evmChainId) return;

    const getWalletInformation = async () => {
      const address = wallet.getAddress();
      const balance = await wallet.getBalance();
      setWalletAddress(address);
      setWalletBalance(+balance);
    };

    getWalletInformation();
  }, [wallet, evmChainId, setWalletBalance]);

  return (
    <header className='min-h-[55px] bg-gray-800 fixed w-full top-0 border-b border-gray-600 text-base z-50'>
      <div className='flex items-center justify-between px-10 min-h-inherit max-w-[1440px] mx-auto'>
        <a href='/' className='text-4xl font-bold text-blue-500'>
          <img className='block' src={ThresholdIcon} alt='threshold-icon' width='42' height='42' />
        </a>

        <nav className='flex gap-4'>
          <Button
            text={isWalletConnected ? `Disconnect: ${croppedAddress}` : 'Connect Wallet'}
            onClick={async () => {
              if (isWalletConnected) {
                setIsWalletConnected(false);
              } else {
                const currentWallet = walletsForChain[0];
                await currentWallet.connect();
                changeWallet(currentWallet);
                setIsWalletConnected(true);
              }
            }}
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;
