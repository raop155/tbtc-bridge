/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, useEffect, useState } from 'react';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { useChangeWallet, useWalletsForChain } from '@xlabs-libs/wallet-aggregator-react';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { getEvmChainId } from '@/consts';
import { EVMWallet } from '@xlabs-libs/wallet-aggregator-evm';
import { Wallet } from '@xlabs-libs/wallet-aggregator-core';
import { ethers, BigNumber, Contract } from 'ethers';
import { ERC20_ABI } from '@/ABI/ERC20';
import { convertToNumber } from '@/utils/utils';
import { getDefaultNativeCurrencySymbol } from '@/consts';
import { useAtom } from 'jotai';
import { targetWalletAtom } from '@/store/store';

type Props = {
  targetChains: {
    id: number;
    name: string;
    disabled: boolean;
  }[];
  selectedTargetChain: any;
  setSelectedTargetChain: Dispatch<any>;
};

const TargetStep = ({ targetChains, selectedTargetChain, setSelectedTargetChain }: Props) => {
  const WH_CHAIN_ID = selectedTargetChain.id;
  const changeWallet = useChangeWallet();
  const { wallet, provider, evmChainId, signer, signerAddress } = useEVMWallet(WH_CHAIN_ID);

  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number | undefined>(undefined);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [, setSourceWallet] = useAtom(targetWalletAtom);

  const walletsForChain = useWalletsForChain(WH_CHAIN_ID);
  // const croppedAddress = `${walletAddress?.slice(0, 5) || ''}...${walletAddress?.slice(-4) || ''}`;

  useEffect(() => {
    if (!wallet) return;
    console.log('target cambia wallet!');
    setSourceWallet({ WH_CHAIN_ID, walletAddress, provider, signer, signerAddress });
  }, [wallet, provider, walletAddress, signer, WH_CHAIN_ID, setSourceWallet, signerAddress]);

  const connectWallet = async () => {
    const currentWallet = walletsForChain[0];
    await currentWallet.connect();
    changeWallet(currentWallet);

    // const currentEVMChainId: number = currentWallet?.getNetworkInfo()?.chainId || evmChainId;
    // if (currentEVMChainId !== getEvmChainId(WH_CHAIN_ID)) {
    //   await (currentWallet as EVMWallet)?.switchChain(Number(getEvmChainId(WH_CHAIN_ID)));
    // }
    getWalletInformation(currentWallet);
    setIsWalletConnected(true);
  };

  const disconnectWallet = async () => {
    await wallet?.disconnect();
    setIsWalletConnected(false);
  };

  const getWalletInformation = async (wallet: Wallet | EVMWallet) => {
    console.log('getWalletInformation');
    const address = wallet.getAddress();
    const balance = await wallet.getBalance();
    const formattedBalance = ethers.utils.formatEther(balance);
    setWalletAddress(address);
    setWalletBalance(+formattedBalance);
  };

  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex items-center justify-between w-full gap-4'>
        <Select
          label='To'
          items={targetChains}
          value={selectedTargetChain}
          setValue={setSelectedTargetChain}
        />

        {/* <Button
          text={isWalletConnected ? `Disconnect: ${croppedAddress}` : 'Connect Wallet'}
          className='self-end'
          style='purple'
          onClick={async () => {
            if (isWalletConnected) {
              disconnectWallet();
            } else {
              connectWallet();
            }
          }}
        /> */}
      </div>
      {isWalletConnected && walletBalance && (
        <div>
          Balance: {walletBalance} {getDefaultNativeCurrencySymbol(WH_CHAIN_ID)}
        </div>
      )}
    </div>
  );
};

export default TargetStep;
