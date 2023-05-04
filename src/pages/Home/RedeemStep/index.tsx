import { ThresholdL2WormholeGateway } from '@/ABI/ThresholdL2WormholeGateway';
import Button from '@/components/Button';
import { getTokenBridgeAddressForChain, THRESHOLD_GATEWAYS } from '@/consts';
import { signedVaaHexAtom, targetWalletAtom } from '@/store/store';
import parseError from '@/utils/parseError';
import { hexToUint8Array, redeemOnEth, redeemOnEthNative } from '@certusone/wormhole-sdk';
import { Contract } from 'ethers';
import { useAtom } from 'jotai';

const RedeemStep = () => {
  const [signedVaaHex] = useAtom(signedVaaHexAtom);
  const [targetWallet] = useAtom(targetWalletAtom);

  const startRedeem = async () => {
    const { WH_CHAIN_ID: targetChainId, signer } = targetWallet;
    if (!signedVaaHex || !signer) return;
    console.log('startRedeem');
    // const isNative = true;
    try {
      const tokenBridgeAddress = getTokenBridgeAddressForChain(targetChainId);
      const signedVAA = signedVaaHex;
      const overrides = {};

      console.log({
        tokenBridgeAddress,
        signer,
        signedVAA,
        hexToUint8Array_signedVAA: hexToUint8Array(signedVAA),
        overrides,
      });

      // const receipt = await redeemOnEthNative(
      //   tokenBridgeAddress,
      //   signer,
      //   hexToUint8Array(signedVAA),
      //   overrides,
      // );

      const receipt = await redeemOnEth(
        tokenBridgeAddress,
        signer,
        hexToUint8Array(signedVAA),
        overrides,
      );

      console.log({ receipt });
      console.log('Transaction complete!');
    } catch (e) {
      console.log(parseError(e));
    }

    // const receipt = isNative
    // ? await redeemOnEthNative(
    //     getTokenBridgeAddressForChain(chainId),
    //     signer,
    //     signedVAA,
    //     overrides
    //   )
    // : await redeemOnEth(
    //     getTokenBridgeAddressForChain(chainId),
    //     signer,
    //     signedVAA,
    //     overrides
    //   );
  };

  const startRedeemGateway = async () => {
    const { WH_CHAIN_ID: targetChainId, provider, signer } = targetWallet;
    const targetAddress = THRESHOLD_GATEWAYS[targetChainId];

    if (!signedVaaHex || !signer) return;
    console.log('startRedeemGateway');
    // const isNative = true;
    try {
      const signedVAA = signedVaaHex;
      const L2WormholeGateway = new Contract(targetAddress, ThresholdL2WormholeGateway, provider);

      console.log({
        thresholdGateway: targetAddress,
        L2WormholeGateway,
        signer,
        signedVAA,
        hexToUint8Array_signedVAA: hexToUint8Array(signedVAA),
      });

      const receipt = await L2WormholeGateway.receiveTbtc(hexToUint8Array(signedVAA));

      console.log({ receipt });
      console.log('Transaction complete!');
    } catch (e) {
      console.log(parseError(e));
    }
  };

  return (
    <div className='w-full'>
      <Button text='Redeem' style='purple' className='w-full' onClick={startRedeemGateway} />
    </div>
  );
};

export default RedeemStep;
