import React from 'react';
import { Subscribe } from 'unstated';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';
import { SessionStateContainer } from './SessionStateContainer';

export function UserWalletList() {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => {
        const activeWalletSessions = sessionStateContainer.getActiveSessions();

        if (activeWalletSessions.length) {
          return (
            <WalletList
              walletSessions={activeWalletSessions}
              onItemDismissClick={walletSession => walletSession.terminate()}
              onItemLogoutClick={walletSession => walletSession.terminate()}
              onItemReconnectClick={walletSession => walletSession.connect()}
            />
          );
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
