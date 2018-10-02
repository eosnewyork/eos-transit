import React, { Component } from 'react';
import styled from 'react-emotion';
import WalletSelectItem, { WalletListItemData } from './WalletListItem';

// Visual components

const WalletListRoot = styled('div')({
  width: '100%'
});

// Exported component

export interface WalletListProps {
  wallets: WalletListItemData[];
}

const walletProvidersInProgress = {
  // 'scatter-desktop': true
};

const walletProvidersWithError = {
  // 'paste-the-private-key': true
};

// TEMP
function isWalletConnecting(walletProviderId: string) {
  return !!walletProvidersInProgress[walletProviderId];
}

function walletHasError(walletProviderId: string) {
  return !!walletProvidersWithError[walletProviderId];
}

export class WalletList extends Component<WalletListProps> {
  render() {
    const { wallets } = this.props;

    return (
      <WalletListRoot>
        {wallets.map(wallet => (
          <WalletSelectItem
            key={wallet.id}
            data={wallet}
            isConnecting={isWalletConnecting(wallet.id)}
            hasError={walletHasError(wallet.id)}
          />
        ))}
      </WalletListRoot>
    );
  }
}

export default WalletList;
