/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, useState, useEffect } from 'react';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { useChangeWallet, useWalletsForChain } from '@xlabs-libs/wallet-aggregator-react';
import { useEVMWallet } from '@/hooks/useEVMWallet';
import { getEvmChainId, getTokenBridgeAddressForChain } from '@/consts';
import { EVMWallet } from '@xlabs-libs/wallet-aggregator-evm';
import { Wallet } from '@xlabs-libs/wallet-aggregator-core';
import { ethers, BigNumber, Contract } from 'ethers';
import { ERC20_ABI } from '@/ABI/ERC20';
import { convertToNumber } from '@/utils/utils';
import { getDefaultNativeCurrencySymbol } from '@/consts';
import { transferFromEth, transferFromEthNative } from '@certusone/wormhole-sdk';
import { sourceTokenAtom, sourceWalletAtom } from '../../../store/store';
import { useAtom } from 'jotai';

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
  const WH_CHAIN_ID = selectedSourceChain.id;
  const changeWallet = useChangeWallet();
  const { wallet, provider, evmChainId, signer, signerAddress } = useEVMWallet(WH_CHAIN_ID);

  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number | undefined>(undefined);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [, setSourceWallet] = useAtom(sourceWalletAtom);
  const [, setSourceToken] = useAtom(sourceTokenAtom);

  const walletsForChain = useWalletsForChain(WH_CHAIN_ID);
  const croppedAddress = `${walletAddress?.slice(0, 5) || ''}...${walletAddress?.slice(-4) || ''}`;

  // useEffect(() => {
  //   if (!provider || !walletAddress) return;

  //   console.log({ walletAddress });

  //   const getBalance = async () => {
  //     const newContract = new Contract(
  //       '0x494701CE895389d917a938f0ea202D4eB9684Eab',
  //       ERC20_ABI,
  //       provider,
  //     );
  //     console.log({ newContract });

  //     const tokenBalancePromise: BigNumber = await newContract.balanceOf(walletAddress);
  //     const decimals = await newContract.decimals();
  //     const name = await newContract.name();
  //     const symbol = await newContract.symbol();

  //     console.log({ converttokenBalancePromise: convertToNumber(tokenBalancePromise, decimals) });
  //   };
  //   getBalance();
  // }, [provider, walletAddress]);

  useEffect(() => {
    if (!wallet) return;
    console.log('source cambia wallet!');
    setSourceWallet({ WH_CHAIN_ID, walletAddress, provider, signer, signerAddress });
    setSourceToken({});
  }, [
    wallet,
    provider,
    walletAddress,
    signer,
    WH_CHAIN_ID,
    signerAddress,
    setSourceWallet,
    setSourceToken,
  ]);

  const connectWallet = async () => {
    console.log('connectWallet');
    const currentWallet = walletsForChain[0];
    await currentWallet.connect();
    changeWallet(currentWallet);

    const currentEVMChainId: number = currentWallet?.getNetworkInfo()?.chainId || evmChainId;
    if (currentEVMChainId !== getEvmChainId(WH_CHAIN_ID)) {
      await (currentWallet as EVMWallet)?.switchChain(Number(getEvmChainId(WH_CHAIN_ID)));
    }
    getWalletInformation(currentWallet);
    setIsWalletConnected(true);
  };

  const disconnectWallet = async () => {
    console.log('disconnectWallet');
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
          label='From'
          items={sourceChains}
          value={selectedSourceChain}
          setValue={setSelectedSourceChain}
        />

        <Button
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
        />
      </div>

      {isWalletConnected && walletBalance && (
        <>
          <Button text='Select token' />
          <div>
            Balance: {walletBalance} {getDefaultNativeCurrencySymbol(WH_CHAIN_ID)}
          </div>
        </>
      )}
    </div>
  );
};

export default SourceStep;
