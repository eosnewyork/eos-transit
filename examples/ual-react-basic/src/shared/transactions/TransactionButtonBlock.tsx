import React, { Component, ReactNode } from 'react';
import styled from 'react-emotion';
import { Subscribe } from 'unstated';
import { WalletModel } from '../wallets/types';
import TransactionButton from './TransactionButton';
import { SessionStateContainer } from '../../core/SessionStateContainer';
import { TransactionAddonBlock } from './TransactionAddonBlock';

// Visual components

const TransactionButtonBlockRoot = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s, transform 0.1s'
});

// Exported component

export interface TransactionButtonBlockProps {
  sessionStateContainer: SessionStateContainer;
  onTransactionRequested?: (transactionWallet: WalletModel) => void;
  onWalletSelect?: (selectedWallet: any) => void;
}

export class TransactionButtonBlock extends Component<
  TransactionButtonBlockProps
> {
  handleTransactionButtonClick = () => {
    const { sessionStateContainer, onTransactionRequested } = this.props;
    const defaultWallet = sessionStateContainer.getDefaultWallet();
    if (defaultWallet && typeof onTransactionRequested === 'function') {
      onTransactionRequested(defaultWallet);
    }
  };

  render() {
    const { handleTransactionButtonClick } = this;
    const inProgress = false;
    const disabled = false;
    const success = false;

    return (
      <TransactionButtonBlockRoot>
        <TransactionButton
          onClick={handleTransactionButtonClick}
          inProgress={inProgress}
          success={success}
          disabled={disabled}
        />
        <TransactionAddonBlock
          disabled={disabled || inProgress || success}
          success={success}
        />
      </TransactionButtonBlockRoot>
    );
  }
}

export function TransactionButtonBlockConnected() {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => (
        <TransactionButtonBlock sessionStateContainer={sessionStateContainer} />
      )}
    </Subscribe>
  );
}

export default TransactionButtonBlockConnected;
