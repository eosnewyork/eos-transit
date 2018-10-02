import React from 'react';
import styled from 'react-emotion';
import { WalletList } from 'shared/wallets/WalletList';

// Visual components

const UserMenuRoot = styled('div')({
  padding: '15px 25px',
  width: 350
});

// Exported / behavior components

// tslint:disable-next-line:no-empty-interface
export interface UserWalletListProps {
  // TODO
}

const wallets = [
  {
    id: 'scatter-desktop',
    name: 'Scatter Desktop',
    description:
      'Scatter Desktop application that keeps your private keys secure'
  },
  {
    id: 'paste-the-private-key',
    name: 'Paste-The-Private-Key™',
    description:
      'Forget about security and just paste your private key directly to sign your transactions'
  },
  {
    id: 'eos-metro',
    name: 'METRO™ Hardware Wallet',
    description:
      'Use secure hardware private key vault to sign your transactions'
  }
];

export function UserWalletList({  }: UserWalletListProps) {
  return <WalletList wallets={wallets} />;
}

export default UserWalletList;
