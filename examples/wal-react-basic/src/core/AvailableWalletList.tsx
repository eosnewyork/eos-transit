import React from 'react';
import WAL from 'wal-eos';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';

const { accessContext } = WAL;

export interface AvailableWalletListProps {
  onItemSelect?: () => void;
}

export function AvailableWalletList({
  onItemSelect
}: AvailableWalletListProps) {
  const addedWallets = accessContext.getWallets();
  const availableWalletProviders = accessContext
    .getWalletProviders()
    .filter(
      walletProvider =>
        !addedWallets.some(w => w.provider.id === walletProvider.id)
    );

  if (!availableWalletProviders.length) {
    return <NoContent message="No available wallet providers" />;
  }

  return (
    <WalletList
      walletProviders={availableWalletProviders}
      onItemSelect={walletProvider => {
        // TODO: Implement in a cleaner way
        accessContext.initWallet(walletProvider);
        if (typeof onItemSelect === 'function') {
          onItemSelect();
        }
      }}
    />
  );
}

export default AvailableWalletList;
