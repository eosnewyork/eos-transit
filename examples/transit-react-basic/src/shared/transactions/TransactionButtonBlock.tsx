import React, { Component, ReactNode } from 'react';
import styled from 'react-emotion';
import { Wallet } from 'eos-transit';
import TransactionButton from './TransactionButton';
import { TransactionAddonBlock } from './TransactionAddonBlock';

// Visual components

const TransactionButtonBlockRoot = styled('div')({});

const TransactionButtonInnerContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s, transform 0.1s'
});

interface TransactionButtonStatusLabelProps {
  hasError?: boolean;
  success?: boolean;
}

const TransactionButtonStatusLabel = styled('div')(
  ({ success, hasError }: TransactionButtonStatusLabelProps) => ({
    padding: '8px 0',
    fontSize: 11,
    fontWeight: 300,
    color: success ? '#29d892' : hasError ? '#e87494' : 'white',
    textAlign: 'center'
  })
);

// Exported component

export interface TransactionButtonBlockProps {
  defaultWallet?: Wallet;
  onTransactionRequested?: (wallet: Wallet) => void;
  onWalletSelect?: (selectedWallet: Wallet) => void;
  disabled?: boolean;
  inProgress?: boolean;
  progressMessage?: string;
  hasError?: boolean;
  errorMessage?: string;
  success?: boolean;
  successMessage?: string;
}

export class TransactionButtonBlock extends Component<
  TransactionButtonBlockProps
> {
  handleTransactionButtonClick = () => {
    const { defaultWallet } = this.props;
    if (defaultWallet) {
      this.requestTransaction(defaultWallet);
    }
  };

  handleWalletSelect = (wallet: Wallet) => {
    return this.requestTransaction(wallet);
  };

  requestTransaction = (wallet: Wallet) => {
    const { onTransactionRequested } = this.props;
    if (wallet && typeof onTransactionRequested === 'function') {
      onTransactionRequested(wallet);
    }
  };

  render() {
    const { handleTransactionButtonClick, handleWalletSelect } = this;
    const {
      disabled,
      inProgress,
      progressMessage,
      hasError,
      errorMessage,
      success,
      successMessage
    } = this.props;

    return (
      <TransactionButtonBlockRoot>
        <TransactionButtonInnerContainer>
          <TransactionButton
            onClick={handleTransactionButtonClick}
            inProgress={inProgress}
            success={success}
            disabled={disabled || inProgress || success}
            danger={hasError}
          />
          <TransactionAddonBlock
            disabled={disabled || inProgress || success}
            success={success}
            danger={hasError}
            onWalletSelect={handleWalletSelect}
          />
        </TransactionButtonInnerContainer>

        <TransactionButtonStatusLabel success={success} hasError={hasError}>
          {inProgress
            ? progressMessage
            : hasError
              ? errorMessage
              : success
                ? successMessage
                : ''}
        </TransactionButtonStatusLabel>
      </TransactionButtonBlockRoot>
    );
  }
}

export default TransactionButtonBlock;
