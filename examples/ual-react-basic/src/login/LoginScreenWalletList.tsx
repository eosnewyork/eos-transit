import React, { Component } from 'react';
import styled from 'react-emotion';
import WalletListItem from '../shared/wallets/WalletListItem';
import { WalletProviderInfo, WalletModel } from 'shared/wallets/types';

// Visual components

const LoginScreenWalletListRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginBottom: 4
});

// Exported component

interface LoginScreenWalletListProps {
  wallets: WalletModel[];
  onWalletSelect?: (wallet: WalletModel) => void;
}

// interface LoginScreenWalletListState {
//   wallets: WalletModel[];
// }

export class LoginScreenWalletList extends Component<
  LoginScreenWalletListProps
> {
  constructor(props: LoginScreenWalletListProps) {
    super(props);
  }

  handleWalletSelect = (wallet: WalletModel) => {
    const { onWalletSelect } = this.props;
    if (typeof onWalletSelect === 'function') {
      onWalletSelect(wallet);
    }
  };

  render() {
    const { handleWalletSelect } = this;
    const { wallets } = this.props;

    return (
      <LoginScreenWalletListRoot>
        {wallets.map(wallet => (
          <WalletListItem
            key={wallet.providerInfo.id}
            onSelect={handleWalletSelect}
            data={wallet}
            large={true}
          />
        ))}
      </LoginScreenWalletListRoot>
    );
  }
}

export default LoginScreenWalletList;
