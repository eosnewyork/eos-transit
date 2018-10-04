import React from 'react';
import { WalletList } from 'shared/wallets/WalletList';
import { WalletModel } from 'shared/wallets/types';

// tslint:disable-next-line:no-empty-interface
export interface AvailableWalletListProps {
  // TODO
}

const wallets: WalletModel[] = [
  {
    providerInfo: {
      id: 'paste-the-private-key',
      name: 'Paste-The-Private-Key™',
      description:
        'Forget about security and just paste your private key directly to sign your transactions'
    },
    connectionStatus: {
      connected: false
    }
  },
  {
    providerInfo: {
      id: 'eos-metro',
      name: 'METRO™ Hardware Wallet',
      description:
        'Use secure hardware private key vault to sign your transactions'
    },
    connectionStatus: {
      connected: false
    }
  }
];

export function AvailableWalletList({  }: AvailableWalletListProps) {
  return <WalletList wallets={wallets} />;
}

export default AvailableWalletList;
