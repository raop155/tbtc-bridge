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
  // transferFromEthNative,
  uint8ArrayToHex,
} from '@certusone/wormhole-sdk';
import { useAtom } from 'jotai';
import parseError from '@/utils/parseError';
import { Contract } from 'ethers';
import { ThresholdL2WormholeGateway } from '@/ABI/ThresholdL2WormholeGateway';

const TransferStep = () => {
  const [sourceWallet] = useAtom(sourceWalletAtom);
  // const [sourceToken] = useAtom(sourceTokenAtom);
  const [targetWallet] = useAtom(targetWalletAtom);
  const [, setSignedVaaHex] = useAtom(signedVaaHexAtom);
  const { WH_CHAIN_ID: sourceChainId } = sourceWallet || {};
  const useThreshold = Boolean(sourceChainId !== CHAIN_ID_ETH);
  const tokenAddress = THRESHOLD_TBTC_CONTRACTS[sourceChainId];
  const amount = useThreshold ? 0.000015 : 0.000001;
  const decimals = 18;
  const amountParsed = parseUnits(String(amount), decimals);

  // const startTransferNoNative = async () => {
  //   console.log('startTransferGateway');

  //   const { WH_CHAIN_ID: sourceChainId, signer, walletAddress: sourceWalletAddress } = sourceWallet;
  //   const { WH_CHAIN_ID: targetChainId, walletAddress: targetWalletAddress } = targetWallet;
  //   if (!signer) return;
  //   try {
  //     console.log('0');

  //     const tokenBridgeAddress = getTokenBridgeAddressForChain(sourceChainId);
  //     const relayerFee = 0;
  //     const relayerFeeParsed = parseUnits(String(relayerFee), decimals);
  //     const payload = sourceWalletAddress; // TODO: Cambiar por `targetWalletAddress`
  //     const targetAddress = sourceWalletAddress; // TODO: Cambiar por `THRESHOLD_GATEWAYS`

  //     const receipt = await transferFromEth(
  //       tokenBridgeAddress,
  //       signer,
  //       tokenAddress,
  //       amountParsed,
  //       targetChainId,
  //       zeroPad(arrayify(targetAddress), 32),
  //       relayerFeeParsed,
  //       {},
  //     );

  //     console.log({ receipt });

  //     const sequence = parseSequenceFromLogEth(receipt, getBridgeAddressForChain(sourceChainId));
  //     const emitterAddress = getEmitterAddressEth(getTokenBridgeAddressForChain(sourceChainId));

  //     console.log({ sequence, emitterAddress });

  //     const { vaaBytes, isPending } = await getSignedVAAWithRetry(
  //       sourceChainId,
  //       emitterAddress,
  //       sequence,
  //     );

  //     if (vaaBytes !== undefined) {
  //       console.log('uint8ArrayToHex(vaaBytes)', uint8ArrayToHex(vaaBytes));
  //       setSignedVaaHex(uint8ArrayToHex(vaaBytes));
  //       console.log({ isPending });
  //       console.log('Fetched Signed VAA');
  //     } else if (isPending) {
  //       console.log({ isPending });
  //       console.log('VAA is Pending');
  //     } else {
  //       throw new Error('Error retrieving VAA info');
  //     }
  //   } catch (e) {
  //     console.log(parseError(e));
  //   }
  // };

  const startTransferGatewayFromEth = async () => {
    console.log('startTransferGatewayFromEth');

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

  const startTransferGatewayNoFromEth = async () => {
    console.log('startTransferGatewayNoFromEth');

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
        { gasLimit: 500000 }, // TODO: how to calculate this
      );

      const receipt = await tx.wait();

      // tx.logs.map((log) => contract.interface.parseLog(log))

      console.log({ receipt });

      // return;

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
      <Button
        text='Transfer'
        style='purple'
        className='w-full'
        onClick={useThreshold ? startTransferGatewayNoFromEth : startTransferGatewayFromEth}
      />
    </div>
  );
};

export default TransferStep;
