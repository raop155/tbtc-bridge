/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTokenBridgeAddressForChain, THRESHOLD_GATEWAYS } from '@/consts';
import {
  approveEth,
  ChainId,
  CHAIN_ID_KLAYTN,
  getAllowanceEth,
  isEVMChain,
} from '@certusone/wormhole-sdk';
import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

export default function useAllowance(
  chainId: ChainId,
  tokenAddress?: string,
  transferAmount?: bigint,
  sourceIsNative = false,
  signer?: any,
  isThreshold = false,
) {
  const [isApproveProcessing, setIsApproveProcessing] = useState(false);
  const [isAllowanceFetching, setIsAllowanceFetching] = useState(false);
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const sufficientAllowance =
    !isEVMChain(chainId) ||
    sourceIsNative ||
    (allowance && transferAmount && allowance >= transferAmount);

  console.log({ chainId, allowance, transferAmount, sufficientAllowance });

  useEffect(() => {
    let cancelled = false;
    if (isEVMChain(chainId) && tokenAddress && signer && !isApproveProcessing) {
      setIsAllowanceFetching(true);
      const contractAddress = isThreshold
        ? THRESHOLD_GATEWAYS[chainId]
        : getTokenBridgeAddressForChain(chainId);
      console.log('allowance contractAddress', contractAddress);
      console.log('allowance tokenAddress', tokenAddress);
      getAllowanceEth(contractAddress, tokenAddress, signer).then(
        (result) => {
          if (!cancelled) {
            setIsAllowanceFetching(false);
            setAllowance(result.toBigInt());
            console.log('result.toBigInt()', result.toBigInt());
          }
        },
        () => {
          if (!cancelled) {
            setIsAllowanceFetching(false);
            //setError("Unable to retrieve allowance"); //TODO set an error
          }
        },
      );
    }

    return () => {
      cancelled = true;
    };
  }, [chainId, tokenAddress, signer, isApproveProcessing, isThreshold]);

  const approveAmount: (amount: bigint) => Promise<any> = useMemo(() => {
    return !isEVMChain(chainId) || !tokenAddress || !signer
      ? () => {
          return Promise.resolve();
        }
      : (amount: bigint) => {
          setIsApproveProcessing(true);
          // Klaytn requires specifying gasPrice
          const gasPricePromise =
            chainId === CHAIN_ID_KLAYTN ? signer.getGasPrice() : Promise.resolve(undefined);

          const contractAddress = isThreshold
            ? THRESHOLD_GATEWAYS[chainId]
            : getTokenBridgeAddressForChain(chainId);
          console.log('allowance contractAddress', contractAddress);
          console.log('allowance tokenAddress', tokenAddress);

          return gasPricePromise.then(
            (gasPrice: any) =>
              approveEth(
                contractAddress,
                tokenAddress,
                signer,
                BigNumber.from(amount),
                gasPrice === undefined ? {} : { gasPrice },
              ).then(
                () => {
                  setIsApproveProcessing(true);
                  return Promise.resolve();
                },
                () => {
                  setIsApproveProcessing(true);
                  return Promise.reject();
                },
              ),
            () => {
              setIsApproveProcessing(true);
              return Promise.reject();
            },
          );
        };
  }, [chainId, tokenAddress, signer, isThreshold]);

  return useMemo(
    () => ({
      sufficientAllowance,
      approveAmount,
      isAllowanceFetching,
      isApproveProcessing,
    }),
    [sufficientAllowance, approveAmount, isAllowanceFetching, isApproveProcessing],
  );
}
