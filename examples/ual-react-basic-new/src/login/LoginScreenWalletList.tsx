import React, { Component } from 'react';
import styled from 'react-emotion';
import { WalletAccessSession, WalletProvider } from 'eos-ual';
import WalletListItem from '../shared/wallets/WalletListItem';

// Visual components

const LoginScreenWalletListRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginBottom: 4
});

// Exported component

interface LoginScreenWalletListProps {
  walletProviders: WalletProvider[];
  walletSessions: WalletAccessSession[];
  onWalletProviderSelect?: (walletProvider: WalletProvider) => void;
  onWalletReconnectClick?: (walletSession: WalletAccessSession) => void;
}

export class LoginScreenWalletList extends Component<
  LoginScreenWalletListProps
> {
  constructor(props: LoginScreenWalletListProps) {
    super(props);
  }

  handleWalletProviderSelect = (walletProvider: WalletProvider) => {
    const { onWalletProviderSelect } = this.props;
    if (walletProvider && typeof onWalletProviderSelect === 'function') {
      onWalletProviderSelect(walletProvider);
    }
  };

  handleReconnectClick = (walletSession: WalletAccessSession) => {
    const { onWalletReconnectClick } = this.props;
    if (walletSession && typeof onWalletReconnectClick === 'function') {
      onWalletReconnectClick(walletSession);
    }
  };

  render() {
    const { handleWalletProviderSelect, handleReconnectClick } = this;
    const { walletProviders, walletSessions } = this.props;

    return (
      <LoginScreenWalletListRoot>
        {walletSessions.map(walletSession => (
          <WalletListItem
            key={walletSession.provider.id}
            onSelect={handleWalletProviderSelect}
            onReconnectClick={handleReconnectClick}
            walletProvider={walletSession.provider}
            walletSession={walletSession}
            large={true}
            dismissable={false}
          />
        ))}
        {walletProviders
          .filter(
            walletProvider =>
              !walletSessions.some(s => s.provider.id === walletProvider.id)
          )
          .map(walletProvider => (
            <WalletListItem
              key={walletProvider.id}
              onSelect={handleWalletProviderSelect}
              onReconnectClick={handleReconnectClick}
              walletProvider={walletProvider}
              large={true}
              dismissable={false}
            />
          ))}
      </LoginScreenWalletListRoot>
    );
  }
}

export default LoginScreenWalletList;
