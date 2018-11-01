import React from 'react';
import WAL from 'wal-eos';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';

const { accessContext } = WAL;

export function UserWalletList() {
  const activeWallets = accessContext.getActiveWallets();

  if (!activeWallets.length) {
    return (
      <NoContent
        message="No active wallets"
        note="Please add one to use the application"
      />
    );
  }

  return (
    <WalletList
      wallets={activeWallets}
      onItemDismissClick={wallet => wallet.terminate()}
      onItemLogoutClick={wallet => wallet.terminate()}
      onItemReconnectClick={wallet => wallet.connect()}
    />
  );
}

export default UserWalletList;
