import {
  ChainId,
  CHAIN_ID_ETH,
  CHAIN_ID_POLYGON,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_OPTIMISM,
  CONTRACTS,
  coalesceChainName,
  CHAIN_ID_BSC,
} from '@certusone/wormhole-sdk';

type INetwork = 'MAINNET' | 'TESTNET' | 'DEVNET';
export const CLUSTER: INetwork = (import.meta.env.VITE_CLUSTER as INetwork) || 'MAINNET';

export const getEvmChainId = (chainId: ChainId) =>
  chainId === CHAIN_ID_ETH
    ? ETH_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_POLYGON
    ? POLYGON_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_ARBITRUM
    ? ARBITRUM_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_OPTIMISM
    ? OPTIMISM_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_BSC
    ? BSC_NETWORK_CHAIN_ID
    : undefined;

export const ETH_NETWORK_CHAIN_ID = CLUSTER === 'MAINNET' ? 1 : CLUSTER === 'TESTNET' ? 5 : 1337;

export const BSC_NETWORK_CHAIN_ID = CLUSTER === 'MAINNET' ? 56 : CLUSTER === 'TESTNET' ? 97 : 1397;

export const POLYGON_NETWORK_CHAIN_ID =
  CLUSTER === 'MAINNET' ? 137 : CLUSTER === 'TESTNET' ? 80001 : 1381;

export const ARBITRUM_NETWORK_CHAIN_ID =
  CLUSTER === 'MAINNET' ? 42161 : CLUSTER === 'TESTNET' ? 421613 : 1381;
export const OPTIMISM_NETWORK_CHAIN_ID =
  CLUSTER === 'MAINNET' ? 10 : CLUSTER === 'TESTNET' ? 420 : 1381;

export const getDefaultNativeCurrencySymbol = (chainId: ChainId) =>
  chainId === CHAIN_ID_ETH
    ? 'ETH'
    : chainId === CHAIN_ID_POLYGON
    ? 'MATIC'
    : chainId === CHAIN_ID_ARBITRUM
    ? 'ETH'
    : chainId === CHAIN_ID_OPTIMISM
    ? 'ETH'
    : chainId === CHAIN_ID_BSC
    ? 'BNB'
    : '';

export const getBridgeAddressForChain = (chainId: ChainId) =>
  CONTRACTS[CLUSTER][coalesceChainName(chainId)].core || '';

export const getTokenBridgeAddressForChain = (chainId: ChainId) =>
  CONTRACTS[CLUSTER][coalesceChainName(chainId)].token_bridge || '';

export const WORMHOLE_RPC_HOSTS =
  CLUSTER === 'MAINNET'
    ? [
        'https://wormhole-v2-mainnet-api.certus.one',
        'https://wormhole.inotel.ro',
        'https://wormhole-v2-mainnet-api.mcf.rocks',
        'https://wormhole-v2-mainnet-api.chainlayer.network',
        'https://wormhole-v2-mainnet-api.staking.fund',
        'https://wormhole-v2-mainnet.01node.com',
      ]
    : CLUSTER === 'TESTNET'
    ? ['https://wormhole-v2-testnet-api.certus.one']
    : ['http://localhost:7071'];

export const THRESHOLD_GATEWAYS: any = {
  [CHAIN_ID_POLYGON]: CLUSTER === 'MAINNET' ? '' : '0xc3D46e0266d95215589DE639cC4E93b79f88fc6C',
  [CHAIN_ID_OPTIMISM]: CLUSTER === 'MAINNET' ? '' : '0xc3D46e0266d95215589DE639cC4E93b79f88fc6C',
  [CHAIN_ID_ARBITRUM]: CLUSTER === 'MAINNET' ? '' : '0xBcD7917282E529BAA6f232DdDc75F3901245A492',
};
