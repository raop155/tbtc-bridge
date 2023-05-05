import Button from '@/components/Button';
import {
  getBridgeAddressForChain,
  getTokenBridgeAddressForChain,
  THRESHOLD_GATEWAYS,
  THRESHOLD_TBTC_CONTRACTS,
} from '@/consts';
import {
  signedVaaHexAtom,
  // sourceTokenAtom,
  sourceWalletAtom,
  targetWalletAtom,
} from '@/store/store';
import { getSignedVAAWithRetry } from '@/utils/getSignedVAA';
import { arrayify, zeroPad } from '@ethersproject/bytes';
import { parseUnits } from 'ethers/lib/utils';
import {
  CHAIN_ID_ETH,
  getEmitterAddressEth,
  hexToUint8Array,
  parseSequenceFromLogEth,
  transferFromEth,
  uint8ArrayToHex,
} from '@certusone/wormhole-sdk';
import { useAtom } from 'jotai';
import parseError from '@/utils/parseError';
import { Contract } from 'ethers';
import { ThresholdL2WormholeGateway } from '@/ABI/ThresholdL2WormholeGateway';

const TransferStep = () => {
  const [sourceWallet] = useAtom(sourceWalletAtom);
  const [targetWallet] = useAtom(targetWalletAtom);
  const [, setSignedVaaHex] = useAtom(signedVaaHexAtom);
  const { WH_CHAIN_ID: sourceChainId } = sourceWallet || {};
  const useThreshold = Boolean(sourceChainId !== CHAIN_ID_ETH);
  const tokenAddress = THRESHOLD_TBTC_CONTRACTS[sourceChainId];
  const amount = useThreshold ? 0.000001 : 0.000015;
  const decimals = 18;
  const amountParsed = parseUnits(String(amount), decimals);

  const startTransferThresholdfromETH = async () => {
    console.log('startTransferThresholdfromETH');

    const { WH_CHAIN_ID: sourceChainId, signer, walletAddress: sourceWalletAddress } = sourceWallet;
    const { WH_CHAIN_ID: targetChainId, walletAddress: targetWalletAddress } = targetWallet;
    if (!signer) return;
    // const isNative = true;
    try {
      const tokenBridgeAddress = getTokenBridgeAddressForChain(sourceChainId);
      const relayerFee = 0;
      const relayerFeeParsed = parseUnits(String(relayerFee), decimals);
      const payload = targetWalletAddress || sourceWalletAddress; // TODO: Cambiar por `targetWalletAddress`
      const targetAddress = THRESHOLD_GATEWAYS[targetChainId];

      console.log({
        tokenBridgeAddress,
        signer,
        tokenAddress,
        amountParsed,
        targetChainId,
        targetAddress,
        zeroPad_arrayify_targetAddress: zeroPad(arrayify(targetAddress), 32),
        relayerFeeParsed,
        payload,
        payload_hexToUint8Array: hexToUint8Array(payload),
        zeroPad_arrayify_payload: zeroPad(arrayify(payload), 32),
      });

      const receipt = await transferFromEth(
        tokenBridgeAddress,
        signer,
        tokenAddress,
        amountParsed,
        targetChainId,
        zeroPad(arrayify(targetAddress), 32),
        relayerFeeParsed,
        {},
        zeroPad(arrayify(payload), 32),
      );

      console.log({ receipt });

      const sequence = parseSequenceFromLogEth(receipt, getBridgeAddressForChain(sourceChainId));
      const emitterAddress = getEmitterAddressEth(getTokenBridgeAddressForChain(sourceChainId));

      console.log({ sequence, emitterAddress });

      const { vaaBytes, isPending } = await getSignedVAAWithRetry(
        sourceChainId,
        emitterAddress,
        sequence,
      );

      if (vaaBytes !== undefined) {
        console.log('uint8ArrayToHex(vaaBytes)', uint8ArrayToHex(vaaBytes));
        setSignedVaaHex(uint8ArrayToHex(vaaBytes));
        console.log({ isPending });
        console.log('Fetched Signed VAA');
      } else if (isPending) {
        console.log({ isPending });
        console.log('VAA is Pending');
      } else {
        throw new Error('Error retrieving VAA info');
      }
    } catch (e) {
      console.log(parseError(e));
    }
  };

  const startTransferThreshold = async () => {
    console.log('startTransferThreshold');

    const { WH_CHAIN_ID: sourceChainId, signer, walletAddress: sourceWalletAddress } = sourceWallet;
    const { WH_CHAIN_ID: targetChainId, walletAddress: targetWalletAddress } = targetWallet;
    const sourceAddress = THRESHOLD_GATEWAYS[sourceChainId];
    const targetAddress = targetWalletAddress || sourceWalletAddress;
    if (!signer) return;
    // const isNative = true;
    try {
      const L2WormholeGateway = new Contract(sourceAddress, ThresholdL2WormholeGateway, signer);

      console.log({
        signer,
        tokenAddress,
        amountParsed,
        targetChainId,
        targetAddress,
        zeroPad_arrayify_targetAddress: zeroPad(arrayify(targetAddress), 32),
      });

      console.log('SEND TBTC');
      const tx = await L2WormholeGateway.sendTbtc(
        amountParsed,
        targetChainId,
        zeroPad(arrayify(targetAddress), 32),
        0,
        1,
        { gasLimit: 5000000 }, // TODO: how to calculate this
      );

      const receipt = await tx.wait();

      console.log({ receipt });

      const sequence = parseSequenceFromLogEth(receipt, getBridgeAddressForChain(sourceChainId));
      const emitterAddress = getEmitterAddressEth(getTokenBridgeAddressForChain(sourceChainId));

      console.log({ sequence, emitterAddress });

      const { vaaBytes, isPending } = await getSignedVAAWithRetry(
        sourceChainId,
        emitterAddress,
        sequence,
      );

      if (vaaBytes !== undefined) {
        console.log('uint8ArrayToHex(vaaBytes)', uint8ArrayToHex(vaaBytes));
        setSignedVaaHex(uint8ArrayToHex(vaaBytes));
        console.log({ isPending });
        console.log('Fetched Signed VAA');
      } else if (isPending) {
        console.log({ isPending });
        console.log('VAA is Pending');
      } else {
        throw new Error('Error retrieving VAA info');
      }
    } catch (e) {
      console.log(parseError(e));
    }
  };

  return (
    <div className='w-full'>
      <div className='mb-2 text-xs text-gray-400'>
        * Has to manually change to the source chain to transfer (Usually you don't need to)
      </div>
      <Button
        text='Transfer'
        style='purple'
        className='w-full'
        onClick={useThreshold ? startTransferThreshold : startTransferThresholdfromETH}
      />
    </div>
  );
};

export default TransferStep;
