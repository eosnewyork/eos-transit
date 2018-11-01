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
        const availableWalletProviders = sessionStateContainer.getAvailableWalletProviders();

        if (availableWalletProviders.length) {
          return (
            <WalletList
              walletProviders={availableWalletProviders}
              onItemSelect={walletProvider => {
                // TODO: Implement in a cleaner way
                sessionStateContainer.addWalletProvider(walletProvider);
                if (typeof onItemSelect === 'function') {
                  onItemSelect();
                }
              }}
            />
          );
        }

        return <NoContent message="No available wallet providers" />;
      }}
    </Subscribe>
  );
}

export default AvailableWalletList;
