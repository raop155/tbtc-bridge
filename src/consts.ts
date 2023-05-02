import { ChainId, CHAIN_ID_ETH, CHAIN_ID_POLYGON } from '@certusone/wormhole-sdk';

type INetwork = 'MAINNET' | 'TESTNET' | 'DEVNET';
export const CLUSTER: INetwork = (import.meta.env.VITE_CLUSTER as INetwork) || 'MAINNET';
// export const CLUSTER: INetwork = 'TESTNET';

export const getEvmChainId = (chainId: ChainId) =>
  chainId === CHAIN_ID_ETH
    ? ETH_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_POLYGON
    ? POLYGON_NETWORK_CHAIN_ID
    : undefined;

export const ETH_NETWORK_CHAIN_ID = CLUSTER === 'MAINNET' ? 1 : CLUSTER === 'TESTNET' ? 5 : 1337;

export const POLYGON_NETWORK_CHAIN_ID =
  CLUSTER === 'MAINNET' ? 137 : CLUSTER === 'TESTNET' ? 80001 : 1381;
