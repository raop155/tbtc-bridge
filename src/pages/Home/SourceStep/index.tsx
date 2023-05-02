/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, useEffect, useState } from 'react';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { useChangeWallet, useWalletsForChain } from '@xlabs-libs/wallet-aggregator-react';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { CHAIN_ID_ETH } from '@certusone/wormhole-sdk';
import { useAtom } from 'jotai';
import { balanceAtom } from '@/store/store';
import { getEvmChainId } from '@/consts';
import { EVMWallet } from '@xlabs-libs/wallet-aggregator-evm';

type Props = {
  sourceChains: {
    id: number;
    name: string;
    disabled: boolean;
  }[];
  selectedSourceChain: any;
  setSelectedSourceChain: Dispatch<any>;
};

const SourceStep = ({ sourceChains, selectedSourceChain, setSelectedSourceChain }: Props) => {
  const changeWallet = useChangeWallet();
  const { wallet, evmChainId } = useEVMWallet(CHAIN_ID_ETH);

  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [, setWalletBalance] = useAtom(balanceAtom);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);

  const walletsForChain = useWalletsForChain(CHAIN_ID_ETH);
  const croppedAddress = `${walletAddress?.slice(0, 5) || ''}...${walletAddress?.slice(-4) || ''}`;

  useEffect(() => {
    if (!wallet) return;

    const getWalletInformation = async () => {
      const address = wallet.getAddress();
      const balance = await wallet.getBalance();
      setWalletAddress(address);
      setWalletBalance(+balance);
    };

    getWalletInformation();
  }, [wallet, setWalletBalance]);

  const connectWallet = async () => {
    const currentWallet = walletsForChain[0];
    await currentWallet.connect();
    changeWallet(currentWallet);

    if (evmChainId !== getEvmChainId(CHAIN_ID_ETH)) {
      await (currentWallet as EVMWallet)?.switchChain(Number(getEvmChainId(CHAIN_ID_ETH)));
    }
    setIsWalletConnected(true);
  };

  const disconnectWallet = async () => {
    await wallet?.disconnect();
    setIsWalletConnected(false);
  };

  return (
    <div className='flex items-center justify-between w-full gap-4'>
      <Select
        label='From'
        items={sourceChains}
        value={selectedSourceChain}
        setValue={setSelectedSourceChain}
      />

      <Button
        text={isWalletConnected ? `Disconnect: ${croppedAddress}` : 'Connect Wallet'}
        className='self-end'
        onClick={async () => {
          if (isWalletConnected) {
            disconnectWallet();
          } else {
            connectWallet();
          }
        }}
      />
    </div>
  );
};

export default SourceStep;
