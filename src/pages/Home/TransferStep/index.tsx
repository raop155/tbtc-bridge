import Button from '@/components/Button';
import {
  getBridgeAddressForChain,
  getTokenBridgeAddressForChain,
  THRESHOLD_GATEWAYS,
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
  getEmitterAddressEth,
  hexToUint8Array,
  parseSequenceFromLogEth,
  transferFromEth,
  transferFromEthNative,
  uint8ArrayToHex,
} from '@certusone/wormhole-sdk';
import { useAtom } from 'jotai';
import parseError from '@/utils/parseError';

const TransferStep = () => {
  const [sourceWallet] = useAtom(sourceWalletAtom);
  // const [sourceToken] = useAtom(sourceTokenAtom);
  const [targetWallet] = useAtom(targetWalletAtom);
  const [, setSignedVaaHex] = useAtom(signedVaaHexAtom);

  const tokenAddress = '0x679874fBE6D4E7Cc54A59e315FF1eB266686a937'; //tBTC (ETH)
  // const tokenAddress = '0xB19693FEB013Bab65866dE0a845a9511064230cE'; // WBNB (ETH)
  const amount = 0.000001;
  const decimals = 18;
  const amountParsed = parseUnits(String(amount), decimals);

  const startTransfer = async () => {
    const { WH_CHAIN_ID: sourceChainId, signer } = sourceWallet;
    const { WH_CHAIN_ID: targetChainId, walletAddress, signerAddress } = targetWallet;
    if (!signer) return;
    // const isNative = true;
    try {
      const tokenBridgeAddress = getTokenBridgeAddressForChain(sourceChainId);
      const amount = 0.001;
      const decimals = 18;
      const amountParsed = parseUnits(String(amount), decimals);
      const targetAddress = walletAddress;
      const relayerFee = 0;
      const relayerFeeParsed = parseUnits(String(relayerFee), decimals);

      console.log({
        tokenBridgeAddress,
        signer,
        amountParsed,
        targetChainId,
        targetAddress,
        signerAddress,
        zeroPad_arrayify_signerAddress: zeroPad(arrayify(signerAddress), 32),
        relayerFeeParsed,
      });

      const receipt = await transferFromEthNative(
        tokenBridgeAddress,
        signer,
        amountParsed,
        targetChainId,
        zeroPad(arrayify(signerAddress), 32),
        relayerFeeParsed,
        {},
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

      // const receipt = isNative
      //   ? await transferFromEthNative(
      //       getTokenBridgeAddressForChain(WH_CHAIN_ID),
      //       signer,
      //       transferAmountParsed,
      //       recipientChain,
      //       recipientAddress,
      //       feeParsed,
      //       overrides
      //     )
      //   : await transferFromEth(
      //       getTokenBridgeAddressForChain(WH_CHAIN_ID),
      //       signer,
      //       tokenAddress,
      //       transferAmountParsed,
      //       recipientChain,
      //       recipientAddress,
      //       feeParsed,
      //       overrides
      //     );
    } catch (e) {
      console.log(parseError(e));
    }
  };

  const startTransferNoNative = async () => {
    console.log('startTransferGateway');

    const { WH_CHAIN_ID: sourceChainId, signer, walletAddress: sourceWalletAddress } = sourceWallet;
    const { WH_CHAIN_ID: targetChainId, walletAddress: targetWalletAddress } = targetWallet;
    if (!signer) return;
    // const isNative = true;
    try {
      console.log('0');

      const tokenBridgeAddress = getTokenBridgeAddressForChain(sourceChainId);
      const relayerFee = 0;
      const relayerFeeParsed = parseUnits(String(relayerFee), decimals);
      const payload = sourceWalletAddress; // TODO: Cambiar por `targetWalletAddress`
      // const targetAddress = THRESHOLD_GATEWAYS[targetChainId];
      const targetAddress = sourceWalletAddress; // TODO: Cambiar por `THRESHOLD_GATEWAYS`

      console.log('1');

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
      });

      console.log('2');

      // return;

      const receipt = await transferFromEth(
        tokenBridgeAddress,
        signer,
        tokenAddress,
        amountParsed,
        targetChainId,
        zeroPad(arrayify(targetAddress), 32),
        relayerFeeParsed,
        {},
        // hexToUint8Array(payload), // FOR THREHOLD GATEWAYS
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

  const startTransferGateway = async () => {
    console.log('startTransferGateway');

    const { WH_CHAIN_ID: sourceChainId, signer, walletAddress: sourceWalletAddress } = sourceWallet;
    const { WH_CHAIN_ID: targetChainId, walletAddress: targetWalletAddress } = targetWallet;
    if (!signer) return;
    // const isNative = true;
    try {
      console.log('0');

      const tokenBridgeAddress = getTokenBridgeAddressForChain(sourceChainId);
      const relayerFee = 0;
      const relayerFeeParsed = parseUnits(String(relayerFee), decimals);
      const payload = targetWalletAddress || sourceWalletAddress; // TODO: Cambiar por `targetWalletAddress`
      const targetAddress = THRESHOLD_GATEWAYS[targetChainId];

      console.log('1');

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
      });

      console.log('2');

      const receipt = await transferFromEth(
        tokenBridgeAddress,
        signer,
        tokenAddress,
        amountParsed,
        targetChainId,
        zeroPad(arrayify(targetAddress), 32),
        relayerFeeParsed,
        {},
        hexToUint8Array(payload),
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

  return (
    <div className='w-full'>
      <Button text='Transfer' style='purple' className='w-full' onClick={startTransferGateway} />
      {/* <Button text='Transfer' style='purple' className='w-full' onClick={startTransferNoNative} /> */}
    </div>
  );
};

export default TransferStep;
