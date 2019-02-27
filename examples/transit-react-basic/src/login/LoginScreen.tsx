import React, { Component } from 'react';
import styled from 'react-emotion';
import { Redirect, withRouter } from 'react-router';
import WAL, { WalletProvider, Wallet, DiscoveryAccount, DiscoveryData } from 'eos-transit';
import { CloseButton } from '../shared/buttons/CloseButton';
import { LoginButton } from './LoginButton';
import { LoginScreenWalletList } from './LoginScreenWalletList';

// Visual components

const LoginScreenRoot = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: 100
});

const ContentPanelHeader = styled('div')({
  display: 'flex',
  width: '100%',
  marginBottom: 15
});

interface ContentPanelHeaderItemProps {
  main?: boolean;
  alignEnd?: boolean;
}

const ContentPanelHeaderItem = styled('div')(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  ({ main, alignEnd }: ContentPanelHeaderItemProps) => {
    const style = {};

    if (main) {
      Object.assign(style, { flex: 1 });
    }

    if (alignEnd) {
      Object.assign(style, { justifyContent: 'flex-end' });
    }

    return style;
  }
);

const ContentPanelHeading = styled('span')({
  fontSize: 12,
  textTransform: 'uppercase',
  fontWeight: 300
});

// Exported components

export interface LoginScreenState {
  showLoginOptions: boolean;
}

export class LoginScreen extends Component<any, LoginScreenState> {
  state = {
    showLoginOptions: false
  };

  switchScreen = () => {
    this.setState(state => ({ showLoginOptions: !state.showLoginOptions }));
  };

  handleWalletProviderSelect = (walletProvider: WalletProvider) => {
    const wallet = WAL.accessContext.initWallet(walletProvider);
    // wallet.connect().then(wallet.discover().then(wallet.login));
    wallet.connect().then(() => {
      wallet.discover().then((discoveryData: DiscoveryData) => {
        // console.log(discoveryData);

        if (discoveryData.keyToAccountMap.length > 0) {
          // console.log(discoveryData.keyToAccountMap.length + ' keys returned, pick one');
          const index = 0;
          const keyObj = discoveryData.keyToAccountMap[index];

          const accountName = keyObj.accounts[0].account;
          const authorization = keyObj.accounts[0].authorization;
          const keyIndex = keyObj.index;
          const key = keyObj.key;

          wallet.login(accountName, authorization, keyIndex, key);
        } else {
          // 0 keys returned, we need to user to select an account
          wallet.login();
        }
      });
    });
  };

  handleWalletReconnectClick = (wallet: Wallet) => {
    wallet.connect().then(wallet.login);
  };

  isLoggedIn = () => !!WAL.accessContext.getActiveWallets().length;

  render() {
    const {
      switchScreen,
      handleWalletProviderSelect,
      handleWalletReconnectClick,
      isLoggedIn
    } = this;
    const { showLoginOptions } = this.state;
    const { getWallets, getWalletProviders } = WAL.accessContext;

    if (isLoggedIn()) return <Redirect to="/" />;

    return (
      
      <LoginScreenRoot>
        {showLoginOptions ? (
          <>
            <ContentPanelHeader>
              <ContentPanelHeaderItem main={true}>
                <ContentPanelHeading>Login Options</ContentPanelHeading>
              </ContentPanelHeaderItem>
              <ContentPanelHeaderItem alignEnd={true}>
                <CloseButton onClick={switchScreen} size={40} />
              </ContentPanelHeaderItem>
            </ContentPanelHeader>
            <LoginScreenWalletList
              walletProviders={getWalletProviders()}
              wallets={getWallets()}
              onWalletProviderSelect={handleWalletProviderSelect}
              onWalletReconnectClick={handleWalletReconnectClick}
            />
          </>
        ) : (
          <LoginButton onClick={switchScreen} />
        )}
      </LoginScreenRoot>
    );
  }
}

export default withRouter(LoginScreen);
