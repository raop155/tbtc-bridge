import React from 'react';
import ReactDOM from 'react-dom/client';
import { WalletContextProvider } from '@xlabs-libs/wallet-aggregator-react';
import {
  InjectedWallet,
  WalletConnectLegacyWallet,
  MetamaskWallet,
} from '@xlabs-libs/wallet-aggregator-evm';
import { CHAIN_ID_ETH } from '@xlabs-libs/wallet-aggregator-core';
import { Provider } from 'jotai';
import App from './App';
import './styles/globals.css';

const AGGREGATOR_WALLETS_BUILDER = async () => {
  return {
    [CHAIN_ID_ETH]: [new InjectedWallet(), new WalletConnectLegacyWallet(), new MetamaskWallet()],
  };
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletContextProvider wallets={AGGREGATOR_WALLETS_BUILDER}>
      <Provider>
        <App />
      </Provider>
    </WalletContextProvider>
  </React.StrictMode>,
);
