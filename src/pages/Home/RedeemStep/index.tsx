import { ThresholdL2WormholeGateway } from '@/ABI/ThresholdL2WormholeGateway';
import Button from '@/components/Button';
import { getTokenBridgeAddressForChain, THRESHOLD_GATEWAYS } from '@/consts';
import { signedVaaHexAtom, targetWalletAtom } from '@/store/store';
import parseError from '@/utils/parseError';
import { CHAIN_ID_ETH, hexToUint8Array, redeemOnEth } from '@certusone/wormhole-sdk';
import { Contract } from 'ethers';
import { useAtom } from 'jotai';

const RedeemStep = () => {
  const [signedVaaHex] = useAtom(signedVaaHexAtom);
  const [targetWallet] = useAtom(targetWalletAtom);
  const { WH_CHAIN_ID: targetChainId } = targetWallet || {};
  const useThreshold = Boolean(targetChainId !== CHAIN_ID_ETH);

  const startRedeemFromWormhole = async () => {
    const { WH_CHAIN_ID: targetChainId, signer } = targetWallet;

    if (!signedVaaHex || !signer) return console.log('no signedVaaHex or signer');
    console.log('startRedeemFromWormhole');
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
  };

  const startRedeemFromThreshold = async () => {
    const { WH_CHAIN_ID: targetChainId, signer } = targetWallet;
    const targetAddress = THRESHOLD_GATEWAYS[targetChainId];

    if (!signedVaaHex || !signer) return console.log('no signedVaaHex or signer');
    console.log('startRedeemFromThreshold');

    // const isNative = true;
    try {
      const signedVAA = signedVaaHex;
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
        { gasLimit: 50000000 }, // TODO: how to calculate this
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
      <Button
        text='Redeem'
        style='purple'
        className='w-full'
        onClick={useThreshold ? startRedeemFromThreshold : startRedeemFromWormhole}
      />
    </div>
  );
};

export default RedeemStep;
