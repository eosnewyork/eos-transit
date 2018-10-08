import React, { Component } from 'react';
import styled from 'react-emotion';
import WalletListItem from '../shared/wallets/WalletListItem';
import { WalletProviderInfo, WalletModel } from 'shared/wallets/types';

// Visual components

const LoginScreenWalletProvidersRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginBottom: 4
});

// Exported component

interface LoginScreenWalletProvidersProps {
  walletProviders: WalletProviderInfo[];
}

interface LoginScreenWalletProvidersState {
  wallets: WalletModel[];
}

export class LoginScreenWalletProviders extends Component<
  LoginScreenWalletProvidersProps,
  LoginScreenWalletProvidersState
> {
  constructor(props: LoginScreenWalletProvidersProps) {
    super(props);

    const wallets = props.walletProviders.map(providerInfo => ({
      providerInfo,
      connectionStatus: { connected: false }
    }));

    this.state = { wallets };
  }

  // getAvailableWallets = () => {
  //   const { walletProviders } = this.props;

  //   return walletProviders.map(providerInfo => ({
  //     providerInfo,
  //     connectionStatus: { connected: false }
  //   }));
  // };

  render() {
    const { wallets } = this.state;

    return (
      <LoginScreenWalletProvidersRoot>
        {wallets.map(wallet => (
          <WalletListItem
            key={wallet.providerInfo.id}
            data={wallet}
            large={true}
          />
        ))}
      </LoginScreenWalletProvidersRoot>
    );
  }
}

export default LoginScreenWalletProviders;
