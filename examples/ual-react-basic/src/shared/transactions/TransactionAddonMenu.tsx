import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import styled from 'react-emotion';
import { SessionStateContainer } from '../../core/SessionStateContainer';
import { WalletModel } from '../wallets/types';
import { TransactionAddonMenuItem } from './TransactionAddonMenuItem';

// Visual components

const TransactionAddonMenuRoot = styled('div')({
  minWidth: 250,
  width: 330,
  padding: '8px'
});

const TransactionAddonMenuHeader = styled('header')({
  padding: '5px 0',
  fontSize: 11,
  fontWeight: 300,
  color: 'white',
  textTransform: 'uppercase',
  marginBottom: 5
});

// Exported component

export interface TransactionAddonMenuProps {
  onWalletSelect?: (selectedWallet: WalletModel) => void;
}

export interface TransactionAddonMenuViewProps
  extends TransactionAddonMenuProps {
  sessionStateContainer: SessionStateContainer;
}

export class TransactionAddonMenu extends Component<
  TransactionAddonMenuViewProps
> {
  handleItemSelect = (wallet: WalletModel) => {
    const { onWalletSelect } = this.props;
    if (typeof onWalletSelect === 'function') {
      onWalletSelect(wallet);
    }
  };

  render() {
    const { handleItemSelect } = this;
    const { sessionStateContainer } = this.props;
    const connectedWallets = sessionStateContainer.getConnectedWallets();

    return (
      <TransactionAddonMenuRoot>
        <TransactionAddonMenuHeader>
          Run with wallet:
        </TransactionAddonMenuHeader>
        {connectedWallets.map(wallet => (
          <TransactionAddonMenuItem
            key={wallet.providerInfo.id}
            wallet={wallet}
            onSelect={handleItemSelect}
          />
        ))}
      </TransactionAddonMenuRoot>
    );
  }
}

export function TransactionAddonMenuConnected(
  props: TransactionAddonMenuProps
) {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => (
        <TransactionAddonMenu
          sessionStateContainer={sessionStateContainer}
          {...props}
        />
      )}
    </Subscribe>
  );
}

export default TransactionAddonMenuConnected;
