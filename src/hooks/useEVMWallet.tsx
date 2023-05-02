import { useCallback, useEffect, useMemo, useState } from 'react';
import { isEVMChain } from '@certusone/wormhole-sdk';
import { ChainId } from '@xlabs-libs/wallet-aggregator-core';
import { EVMWallet } from '@xlabs-libs/wallet-aggregator-evm';
import { useWallet } from '@xlabs-libs/wallet-aggregator-react';
import { ethers } from 'ethers';

export type Provider = ethers.providers.Web3Provider | undefined;
export type Signer = ethers.Signer | undefined;

interface IEthereumContext {
  provider: Provider;
  evmChainId: number | undefined;
  signer: Signer;
  signerAddress: string | undefined;
  wallet: EVMWallet | undefined;
  switchNetwork: (currentEvmChainId: number | undefined) => void;
}

export const useEVMWallet = (chainId: ChainId): IEthereumContext => {
  const wallet = useWallet<EVMWallet>(chainId);
  const [signerAddress, setSignerAddress] = useState<string | undefined>();
  const [evmChainId, setEvmChainId] = useState<number | undefined>();
  const [signer, setSigner] = useState<ethers.Signer | undefined>();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>();

  const switchNetwork = useCallback(
    (currentEvmChainId: number | undefined) => {
      if (!currentEvmChainId) return;
      const newEvmChainId = wallet?.getNetworkInfo()?.chainId;
      if (currentEvmChainId !== newEvmChainId) wallet?.switchChain(Number(newEvmChainId));
      setEvmChainId(newEvmChainId);
    },
    [wallet],
  );

  useEffect(() => {
    if (!isEVMChain(chainId)) return;

    setSignerAddress(wallet?.getAddress());
    setEvmChainId(wallet?.getNetworkInfo()?.chainId);
    setSigner(wallet?.getSigner());
    setProvider(wallet?.getProvider());

    const handleNetworkChange = async () => {
      switchNetwork(evmChainId);
    };

    wallet?.on('networkChanged', handleNetworkChange);
    return () => {
      wallet?.off('networkChanged', handleNetworkChange);
    };
  }, [wallet, chainId, evmChainId, switchNetwork]);

  return useMemo(
    () => ({
      provider,
      evmChainId,
      signer,
      signerAddress,
      wallet,
      switchNetwork,
    }),
    [provider, evmChainId, signer, signerAddress, wallet, switchNetwork],
  );
};
