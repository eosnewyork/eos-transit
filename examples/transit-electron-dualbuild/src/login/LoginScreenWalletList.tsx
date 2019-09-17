import React, { Component } from 'react';
import styled from 'react-emotion';
import { Wallet, WalletProvider } from 'eos-transit';
import WalletListItem from '../shared/wallets/WalletListItem';
import WalletStateSubscribe from '../WalletStateSubscribe';
import AccessContextSubscribe from 'AccessContextSubscribe';
import {ConnectSettings} from '../shared/providers/ProviderTypes'

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
  onWalletProviderSelect?: (walletProvider: WalletProvider, connectSettings: ConnectSettings) => void;
  onWalletReconnectClick?: (wallets: Wallet, connectSettings: ConnectSettings) => void;
}

export class LoginScreenWalletList extends Component<
  LoginScreenWalletListProps
> {

  handleWalletProviderSelect = (walletProvider: WalletProvider, pin: any) => {
    const { onWalletProviderSelect } = this.props;
    if (walletProvider && typeof onWalletProviderSelect === 'function') {
      onWalletProviderSelect(walletProvider, pin);
    }
  };

  handleReconnectClick = (walletSession: Wallet, connectSettings: ConnectSettings) => {
    const { onWalletReconnectClick } = this.props;
    if (walletSession && typeof onWalletReconnectClick === 'function') {
      onWalletReconnectClick(walletSession, connectSettings);
    }
  };

  render() {
    const { handleWalletProviderSelect, handleReconnectClick } = this;
    const { walletProviders, wallets } = this.props;
    const availableWalletProviders = walletProviders.filter(
      walletProvider => !wallets.some(w => w.provider.id === walletProvider.id)
    );

    return (
      <AccessContextSubscribe>
        {() => (
          <LoginScreenWalletListRoot>
            {wallets.map(wallet => (
              <WalletStateSubscribe wallet={wallet} key={wallet.provider.id}>
                {() => (
                  <WalletListItem
                    onSelect={handleWalletProviderSelect}
                    onReconnectClick={handleReconnectClick}
                    walletProvider={wallet.provider}
                    wallet={wallet}
                    large={true}
                    dismissable={false}
                  />
                )}
              </WalletStateSubscribe>
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
        )}
      </AccessContextSubscribe>
    );
  }
}

export default LoginScreenWalletList;
