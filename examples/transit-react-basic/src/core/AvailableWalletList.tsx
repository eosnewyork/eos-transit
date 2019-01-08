import React from 'react';
import WAL from 'eos-transit';
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
        if (typeof onItemSelect === 'function') {
          onItemSelect();
        }
        const wallet = accessContext.initWallet(walletProvider);
        wallet.connect().then(wallet.login);
      }}
    />
  );
}

export default AvailableWalletList;
