import React from 'react';
import { Subscribe } from 'unstated';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';
import SessionStateContainer from './SessionStateContainer';

export interface AvailableWalletListProps {
  onItemSelect?: () => void;
}

export function AvailableWalletList({
  onItemSelect
}: AvailableWalletListProps) {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => {
        const availableWallets = sessionStateContainer.getAvailableWallets();

        if (availableWallets.length) {
          return (
            <WalletList
              wallets={availableWallets}
              onItemSelect={wallet => {
                // TODO: Implement in a cleaner way
                sessionStateContainer.addWallet(wallet);
                if (typeof onItemSelect === 'function') {
                  onItemSelect();
                }
              }}
              onItemDismissClick={sessionStateContainer.dismissWallet}
              onItemLogoutClick={sessionStateContainer.logoutWallet}
              onItemReconnectClick={sessionStateContainer.connectToWallet}
            />
          );
        }

        return <NoContent message="No available wallet providers" />;
      }}
    </Subscribe>
  );
}

export default AvailableWalletList;
