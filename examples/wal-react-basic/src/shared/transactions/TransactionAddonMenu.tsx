import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import styled from 'react-emotion';
import { WalletAccessSession } from 'wal-eos';
import { SessionStateContainer } from '../../core/SessionStateContainer';
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
  onWalletSelect?: (selectedWalletSession: WalletAccessSession) => void;
}

export interface TransactionAddonMenuViewProps
  extends TransactionAddonMenuProps {
  sessionStateContainer: SessionStateContainer;
}

export class TransactionAddonMenu extends Component<
  TransactionAddonMenuViewProps
> {
  handleItemSelect = (walletSession: WalletAccessSession) => {
    const { onWalletSelect } = this.props;
    if (typeof onWalletSelect === 'function') {
      onWalletSelect(walletSession);
    }
  };

  render() {
    const { handleItemSelect } = this;
    const { sessionStateContainer } = this.props;
    const activeSessions = sessionStateContainer.getActiveSessions();

    return (
      <TransactionAddonMenuRoot>
        <TransactionAddonMenuHeader>
          Run with wallet:
        </TransactionAddonMenuHeader>
        {activeSessions.map(walletSession => (
          <TransactionAddonMenuItem
            key={walletSession.provider.id}
            walletSession={walletSession}
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
