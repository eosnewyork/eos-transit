import React, { Component } from 'react';
import styled from 'react-emotion';
import { WalletAccessSession, WalletProvider } from 'eos-ual';
import WalletListItem from './WalletListItem';

// Visual components

const WalletListRoot = styled('div')({
  width: '100%',
  marginBottom: 4
});

// Exported component

export interface WalletListProps {
  walletProviders?: WalletProvider[];
  walletSessions?: WalletAccessSession[];
  onItemSelect?: (item: WalletProvider) => void;
  onItemDismissClick?: (item: WalletAccessSession) => void;
  onItemLogoutClick?: (item: WalletAccessSession) => void;
  onItemReconnectClick?: (item: WalletAccessSession) => void;
}

export class WalletList extends Component<WalletListProps> {
  render() {
    const {
      walletProviders,
      walletSessions,
      onItemSelect,
      onItemDismissClick,
      onItemLogoutClick,
      onItemReconnectClick
    } = this.props;

    return (
      <WalletListRoot>
        {walletProviders &&
          walletProviders.map(walletProvider => (
            <WalletListItem
              key={walletProvider.id}
              walletProvider={walletProvider}
              onSelect={onItemSelect}
              onDismissClick={onItemDismissClick}
              onLogoutClick={onItemLogoutClick}
              onReconnectClick={onItemReconnectClick}
            />
          ))}
        {walletSessions &&
          walletSessions.map(walletSession => (
            <WalletListItem
              key={walletSession.provider.id}
              walletProvider={walletSession.provider}
              walletSession={walletSession}
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
