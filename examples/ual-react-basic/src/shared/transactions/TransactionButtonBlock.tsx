import React, { Component, ReactNode } from 'react';
import styled from 'react-emotion';
import { Subscribe } from 'unstated';
import { WalletModel } from '../wallets/types';
import TransactionButton from './TransactionButton';
import { SessionStateContainer } from '../../core/SessionStateContainer';
import { TransactionAddonBlock } from './TransactionAddonBlock';

// Visual components

interface TransactionButtonBlockRootProps {
  keepUnpressed?: boolean;
}

// TODO: Probable move shadow/transform to some kind of "buttons container"
// and preserve the root clean, to also contain "status label"

const TransactionButtonBlockRoot = styled('div')(
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',

    boxShadow: '0 7px 25px -4px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.2s, transform 0.1s',

    '&:active': {
      boxShadow: '0 3px 15px -4px rgba(0, 0, 0, 0.8)',
      transform: 'translateY(1px) scale(0.99)'
    }
  },
  ({ keepUnpressed }: TransactionButtonBlockRootProps) => {
    if (keepUnpressed) {
      return {
        '&, &:active': {
          boxShadow: '0 3px 15px -4px rgba(0, 0, 0, 0.4)',
          transform: 'translateY(0px) scale(1)'
        }
      };
    }

    return {};
  }
);

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
      <TransactionButtonBlockRoot
        keepUnpressed={disabled || inProgress || success}
      >
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
