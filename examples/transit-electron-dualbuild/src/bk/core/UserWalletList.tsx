import React from 'react';
import WAL from 'eos-transit';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';

const { accessContext } = WAL;

export function UserWalletList() {
  const wallets = accessContext.getWallets();

  if (!wallets.length) {
    return (
      <NoContent
        message="No active wallets"
        note="Please add one to use the application"
      />
    );
  }

  return (
    <WalletList
      wallets={wallets}
      onItemDismissClick={wallet => wallet.terminate()}
      onItemLogoutClick={wallet => wallet.terminate()}
      onItemReconnectClick={wallet => wallet.connect()}
    />
  );
}

export default UserWalletList;
