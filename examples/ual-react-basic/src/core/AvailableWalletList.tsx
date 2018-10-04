import React from 'react';
import { Subscribe } from 'unstated';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';
import SessionStateContainer from './SessionStateContainer';

export function AvailableWalletList() {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => {
        const availableWallets = sessionStateContainer.getAvailableWallets();

        if (availableWallets.length) {
          return <WalletList wallets={availableWallets} />;
        }

        return <NoContent message="No available wallet providers" />;
      }}
    </Subscribe>
  );
}

export default AvailableWalletList;
