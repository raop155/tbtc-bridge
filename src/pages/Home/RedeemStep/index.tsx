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
    const { WH_CHAIN_ID: targetChainId, signer } = targetWallet;
    const targetAddress = THRESHOLD_GATEWAYS[targetChainId];

    console.log({ targetChainId });

    if (!signedVaaHex || !signer) return console.log('no signedVaaHex or signer');
    // console.log('startRedeemGateway');
    // const isNative = true;
    try {
      const signedVAA = signedVaaHex;
      // const signedVAA =
      //   '0100000000010003a177e441f2f46068037f14ce9e0dee086306c320e4df0089780b02cd08ec0509e81c34748dc4ef569d0e9968ddc2fa6e9722fd8e3c6585822baaf4f0b4e70400645428b8000000040005000000000000000000000000377d55a7928c046e18eebb61977e714d2a76472a000000000000086a0f030000000000000000000000000000000000000000000000000000000000000064000000000000000000000000679874fbe6d4e7cc54a59e315ff1eb266686a9370002000000000000000000000000e3e0511eebd87f08fbae4486419cb5dfb06e13430017000000000000000000000000c3d46e0266d95215589de639cc4e93b79f88fc6c000000000000000000000000089d4e139ff6801eba327e301ab47ea15e0e12ae';
      const L2WormholeGateway = new Contract(targetAddress, ThresholdL2WormholeGateway, signer);

      console.log({
        thresholdGatewayAddress: targetAddress,
        L2WormholeGateway,
        signer,
        signedVAA,
        hexToUint8Array_signedVAA: hexToUint8Array(signedVAA),
      });

      const tx = await L2WormholeGateway.receiveTbtc(
        hexToUint8Array(signedVAA),
        { gasLimit: 500000 }, // TODO: how to calculate this
      );

      const receipt = await tx.wait();

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
