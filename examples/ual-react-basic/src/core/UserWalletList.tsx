import React from 'react';
import { Subscribe } from 'unstated';
import { WalletList } from '../shared/wallets/WalletList';
import { SessionStateContainer } from './SessionStateContainer';

export function UserWalletList() {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => (
        <WalletList wallets={sessionStateContainer.getActiveWallets()} />
      )}
    </Subscribe>
  );
}

export default UserWalletList;
