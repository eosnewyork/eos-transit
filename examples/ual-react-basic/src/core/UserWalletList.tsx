import React from 'react';
import { Subscribe } from 'unstated';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';
import { SessionStateContainer } from './SessionStateContainer';

export function UserWalletList() {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => {
        const activeWallets = sessionStateContainer.getActiveWallets();

        if (activeWallets.length) {
          return <WalletList wallets={activeWallets} />;
        }

        return (
          <NoContent
            message="No active wallets"
            note="Please add one to use the application"
          />
        );
      }}
    </Subscribe>
  );
}

export default UserWalletList;
