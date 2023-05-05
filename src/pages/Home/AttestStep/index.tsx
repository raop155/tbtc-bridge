import { getTokenBridgeAddressForChain, THRESHOLD_TBTC_CONTRACTS } from '@/consts';
import { sourceWalletAtom, targetWalletAtom } from '@/store/store';
import { getForeignAssetEth, hexToUint8Array } from '@certusone/wormhole-sdk';
import { ethers } from 'ethers';
import { arrayify, zeroPad } from 'ethers/lib/utils.js';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

const AttestStep = () => {
  const [sourceWallet] = useAtom(sourceWalletAtom);
  const [targetWallet] = useAtom(targetWalletAtom);

  const { WH_CHAIN_ID: sourceChainId } = sourceWallet || {};
  const { WH_CHAIN_ID: targetChainId, provider } = targetWallet || {};
  const tokenAddress = THRESHOLD_TBTC_CONTRACTS[sourceChainId];

  const [isAttested, setIsAttested] = useState(false);

  useEffect(() => {
    if (!provider && !targetChainId && !sourceChainId && !tokenAddress) return;

    const startGetForeignAssetEth = async () => {
      console.log('startGetForeignAssetEth');

      console.log({
        tokenBridgeAddress: getTokenBridgeAddressForChain(targetChainId),
        provider,
        sourceChainId,
        tokenAddress,
        zeroPad_arraify_tokenAddress: zeroPad(arrayify(tokenAddress), 32),
      });

      const asset = await getForeignAssetEth(
        getTokenBridgeAddressForChain(targetChainId),
        provider,
        2,
        zeroPad(arrayify(tokenAddress), 32),
      );

      console.log({ asset });

      if (asset && asset !== ethers.constants.AddressZero) {
        setIsAttested(true);
      }
    };

    startGetForeignAssetEth();
  }, [provider, sourceChainId, targetChainId, tokenAddress]);

  return (
    <div>
      <div className='mb-2 text-xs text-gray-400'>
        * Has to manually change to the target chain to check if the token is attested
      </div>
      <div>is Token already attested? {isAttested ? 'YES' : 'NO'}</div>
    </div>
  );
};

export default AttestStep;
