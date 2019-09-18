import React from 'react';
import WAL, { Wallet } from 'eos-transit';
import { NoContent } from '../shared/NoContent';
import { WalletList } from '../shared/wallets/WalletList';
import { ConnectSettings } from '../shared/providers/ProviderTypes'
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

  const handleWalletReconnectClick = (wallet: Wallet, connectSettings: ConnectSettings) => {
    // @ts-ignore
    wallet.connect(connectSettings).then(wallet.login);
  };

  return (
    <WalletList
      wallets={wallets}
      onItemDismissClick={wallet => wallet.terminate()}
      onItemLogoutClick={wallet => wallet.terminate()}
      onItemReconnectClick={handleWalletReconnectClick}
    />
  );
}

export default UserWalletList;
