import React from 'react';
import { Subscribe } from 'unstated';
import { WalletList } from '../shared/wallets/WalletList';
import SessionStateContainer from './SessionStateContainer';
import { NoContent } from 'shared/NoContent';

export function AvailableWalletList() {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => {
        const availableWallets = sessionStateContainer.getAvailableWallets();

        if (availableWallets.length) {
          return <WalletList wallets={availableWallets} />;
        }

        return <NoContent message="No Wallet Providers available" />;
      }}
    </Subscribe>
  );
}

export default AvailableWalletList;
