import React, { Component } from 'react';
import styled from 'react-emotion';
import WalletSelectItem from './WalletListItem';
import { WalletModel } from './types';

// Visual components

const WalletListRoot = styled('div')({
  width: '100%'
});

// Exported component

export interface WalletListProps {
  wallets: WalletModel[];
}

export class WalletList extends Component<WalletListProps> {
  render() {
    const { wallets } = this.props;

    return (
      <WalletListRoot>
        {wallets.map(wallet => (
          <WalletSelectItem key={wallet.providerInfo.id} data={wallet} />
        ))}
      </WalletListRoot>
    );
  }
}

export default WalletList;
