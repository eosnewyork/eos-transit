import React, { Component } from 'react';
import styled from 'react-emotion';
import WalletSelectItem from './WalletListItem';
import { WalletModel } from './types';

// Visual components

const WalletListRoot = styled('div')({
  width: '100%',
  marginBottom: 4
});

// Exported component

export interface WalletListProps {
  wallets: WalletModel[];
  onItemSelect?: (item: WalletModel) => void;
  onItemDismissClick?: (item: WalletModel) => void;
  onItemLogoutClick?: (item: WalletModel) => void;
  onItemReconnectClick?: (item: WalletModel) => void;
}

export class WalletList extends Component<WalletListProps> {
  render() {
    const {
      wallets,
      onItemSelect,
      onItemDismissClick,
      onItemLogoutClick,
      onItemReconnectClick
    } = this.props;

    return (
      <WalletListRoot>
        {wallets.map(wallet => (
          <WalletSelectItem
            key={wallet.providerInfo.id}
            data={wallet}
            onSelect={onItemSelect}
            onDismissClick={onItemDismissClick}
            onLogoutClick={onItemLogoutClick}
            onReconnectClick={onItemReconnectClick}
          />
        ))}
      </WalletListRoot>
    );
  }
}

export default WalletList;
