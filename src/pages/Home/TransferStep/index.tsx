import Button from '@/components/Button';
import { getBridgeAddressForChain, getTokenBridgeAddressForChain } from '@/consts';
import {
  signedVaaHexAtom,
  sourceTokenAtom,
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
  transferFromEthNative,
  uint8ArrayToHex,
} from '@certusone/wormhole-sdk';
import { useAtom } from 'jotai';

const TransferStep = () => {
  const [sourceWallet] = useAtom(sourceWalletAtom);
  const [sourceToken] = useAtom(sourceTokenAtom);
  const [targetWallet] = useAtom(targetWalletAtom);
  const [, setSignedVaaHex] = useAtom(signedVaaHexAtom);

  console.log({
    sourceWallet,
    sourceToken,
    targetWallet,
  });

  const startTransfer = async () => {
    const { WH_CHAIN_ID: sourceChainId, signer } = sourceWallet;
    const { WH_CHAIN_ID: targetChainId, walletAddress, signerAddress } = targetWallet;
    if (!signer) return;
    // const isNative = true;

    console.log('startTransfer');

    const tokenBridgeAddress = getTokenBridgeAddressForChain(sourceChainId);
    console.log('1');
    const amount = 0.001;
    const decimals = 18;
    const amountParsed = parseUnits(String(amount), decimals);
    console.log('2');
    const targetAddress = walletAddress;
    const relayerFee = 0;
    const relayerFeeParsed = parseUnits(String(relayerFee), decimals);
    console.log('3');

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
  };

  return (
    <div className='w-full'>
      <Button text='Transfer' style='purple' className='w-full' onClick={startTransfer} />
    </div>
  );
};

export default TransferStep;
