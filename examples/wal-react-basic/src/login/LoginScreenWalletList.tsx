import React, { Component } from 'react';
import styled from 'react-emotion';
import { Wallet, WalletProvider } from 'wal-eos';
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
  wallets: Wallet[];
  onWalletProviderSelect?: (walletProvider: WalletProvider) => void;
  onWalletReconnectClick?: (wallets: Wallet) => void;
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

  handleReconnectClick = (walletSession: Wallet) => {
    const { onWalletReconnectClick } = this.props;
    if (walletSession && typeof onWalletReconnectClick === 'function') {
      onWalletReconnectClick(walletSession);
    }
  };

  render() {
    const { handleWalletProviderSelect, handleReconnectClick } = this;
    const { walletProviders, wallets } = this.props;
    const availableWalletProviders = walletProviders.filter(
      walletProvider => !wallets.some(w => w.provider.id === walletProvider.id)
    );

    return (
      <LoginScreenWalletListRoot>
        {wallets.map(wallet => (
          <WalletListItem
            key={wallet.provider.id}
            onSelect={handleWalletProviderSelect}
            onReconnectClick={handleReconnectClick}
            walletProvider={wallet.provider}
            wallet={wallet}
            large={true}
            dismissable={false}
          />
        ))}
        {availableWalletProviders.map(walletProvider => (
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
