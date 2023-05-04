/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTokenBridgeAddressForChain } from '@/consts';
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
) {
  const [isApproveProcessing, setIsApproveProcessing] = useState(false);
  const [isAllowanceFetching, setIsAllowanceFetching] = useState(false);
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const sufficientAllowance =
    !isEVMChain(chainId) ||
    sourceIsNative ||
    (allowance && transferAmount && allowance >= transferAmount);

  console.log({ allowance, transferAmount, sufficientAllowance });

  useEffect(() => {
    let cancelled = false;
    console.log('entro');
    if (isEVMChain(chainId) && tokenAddress && signer && !isApproveProcessing) {
      console.log('entro 2');
      setIsAllowanceFetching(true);
      getAllowanceEth(getTokenBridgeAddressForChain(chainId), tokenAddress, signer).then(
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
  }, [chainId, tokenAddress, signer, isApproveProcessing]);

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
          return gasPricePromise.then(
            (gasPrice: any) =>
              approveEth(
                getTokenBridgeAddressForChain(chainId),
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
  }, [chainId, tokenAddress, signer]);

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
