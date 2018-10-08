import React, { Component } from 'react';
import styled from 'react-emotion';
import { Subscribe } from 'unstated';
import { Redirect } from 'react-router';
import { CloseButton } from '../shared/buttons/CloseButton';
import { WalletModel } from '../shared/wallets/types';
import { SessionStateContainer } from '../core/SessionStateContainer';
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

// TEMP
const walletProviders = [
  {
    id: 'scatter-desktop',
    name: 'Scatter Desktop',
    description:
      'Scatter Desktop application that keeps your private keys secure'
  },
  {
    id: 'eos-metro',
    name: 'METRO™ Hardware Wallet',
    description:
      'Use secure hardware private key vault to sign your transactions'
  },
  {
    id: 'paste-the-private-key',
    name: 'Paste-The-Private-Key™',
    description:
      'Forget about security and just paste your private key directly to sign your transactions'
  }
];

export interface LoginScreenProps {
  sessionStateContainer: SessionStateContainer;
}

export interface LoginScreenState {
  showLoginOptions: boolean;
}

export class LoginScreen extends Component<LoginScreenProps, LoginScreenState> {
  state = {
    showLoginOptions: false
  };

  switchScreen = () => {
    this.setState(state => ({ showLoginOptions: !state.showLoginOptions }));
  };

  handleWalletSelect = (wallet: WalletModel) => {
    const { sessionStateContainer } = this.props;
    sessionStateContainer.addWallet(wallet);
  };

  handleWalletReconnectClick = (wallet: WalletModel) => {
    const { sessionStateContainer } = this.props;
    sessionStateContainer.connectToWallet(wallet);
  };

  getAvailableWalletProviders = () => {
    // TODO: Will be taken from configured UAL instance directly
    return walletProviders;
  };

  render() {
    const {
      switchScreen,
      handleWalletSelect,
      handleWalletReconnectClick
    } = this;
    const { sessionStateContainer } = this.props;
    const { showLoginOptions } = this.state;
    const { state, isLoggedIn } = sessionStateContainer;

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
              wallets={sessionStateContainer.getAllWallets()}
              onWalletSelect={handleWalletSelect}
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

export default function LoginScreenConnected() {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => (
        <LoginScreen sessionStateContainer={sessionStateContainer} />
      )}
    </Subscribe>
  );
}
