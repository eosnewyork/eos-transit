import React from 'react';
import styled from 'react-emotion';
import { WalletList } from 'shared/wallets/WalletList';
import { WalletModel } from 'shared/wallets/types';

// Visual components

const UserWalletListRoot = styled('div')({
  marginBottom: 4
});

// Exported / behavior components

// tslint:disable-next-line:no-empty-interface
export interface UserWalletListProps {
  // TODO
}

const wallets: WalletModel[] = [
  {
    providerInfo: {
      id: 'scatter-desktop',
      name: 'Scatter Desktop',
      description:
        'Scatter Desktop application that keeps your private keys secure'
    },
    connectionStatus: {
      connected: true
    },
    walletInfo: {
      accountName: 'bob123451234',
      accountAuthority: 'active',
      eosBalance: 99963.0000,
      ram: 1020241, // Kb
      cpu: 10793253535, // ms
      net: 56587736535 // KiB
    }
  },
  {
    providerInfo: {
      id: 'paste-the-private-key',
      name: 'Paste-The-Private-Key™',
      description:
        'Forget about security and just paste your private key directly to sign your transactions'
    },
    connectionStatus: {
      connected: false,
      error: true,
      errorMessage: 'Connection error, please try again'
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
      connected: false,
      connecting: true
    }
  }
];

export function UserWalletList({  }: UserWalletListProps) {
  return (
    <UserWalletListRoot>
      <WalletList wallets={wallets} />
    </UserWalletListRoot>
  );
}

export default UserWalletList;
