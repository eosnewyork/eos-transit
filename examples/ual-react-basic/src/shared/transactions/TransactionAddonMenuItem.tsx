import React, { Component } from 'react';
import styled from 'react-emotion';
import { WalletModel } from '../wallets/types';
import { WalletProviderIcon } from '../wallets/WalletProviderIcon';

// Visual components

const TransactionAddonMenuItemRoot = styled('div')({
  display: 'flex',
  width: '100%',
  // padding: '10px 10px',
  fontSize: 12,
  borderRadius: 1,
  backgroundColor: '#2e3542',

  '&:not(:last-child)': {
    marginBottom: 2
  },

  '&:hover': {
    backgroundColor: '#40495a',
    cursor: 'pointer'
  },

  '&:active': {
    backgroundColor: '#3a576b'
  }
});

const TransactionAddonMenuItemIcon = styled('div')({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: 40,
  padding: 10,
  fontSize: 18,
  color: '#26c5df'
});

const TransactionAddonMenuItemBody = styled('div')({
  flex: 1,
  padding: '10px 10px 10px 0'
});

const TransactionAddonMenuItemLabel = styled('div')({
  color: '#26c5df',

  '&:not(:last-child)': {
    marginBottom: 2
  }
});

const TransactionAddonMenuItemSublabel = styled('div')({
  fontSize: 11,
  color: 'white',

  '&:not(:last-child)': {
    marginBottom: 2
  }
});

const TransactionAddonMenuItemBalance = styled('div')({
  padding: '10px 15px 10px 0',
  width: 130,
  fontSize: 14,
  fontWeight: 300,

  '&:not(:last-child)': {
    marginBottom: 8
  },

  '& strong': {
    fontWeight: 400
  },

  '& small': {
    fontSize: 14
  }
});

// Exported component

export interface TransactionAddonMenuItemProps {
  wallet: WalletModel;
  onSelect?: (wallet: WalletModel) => void;
}

export class TransactionAddonMenuItem extends Component<
  TransactionAddonMenuItemProps
> {
  handleClick = () => {
    const { onSelect, wallet } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(wallet);
    }
  };
  render() {
    const { handleClick } = this;
    const { wallet } = this.props;
    const { walletInfo } = wallet;

    return (
      <TransactionAddonMenuItemRoot onClick={handleClick}>
        <TransactionAddonMenuItemIcon>
          <WalletProviderIcon providerId={wallet.providerInfo.id} />
        </TransactionAddonMenuItemIcon>

        {walletInfo && (
          <>
            <TransactionAddonMenuItemBody>
              <>
                <TransactionAddonMenuItemLabel>
                  {walletInfo.accountName}@{walletInfo.accountAuthority}
                </TransactionAddonMenuItemLabel>
                <TransactionAddonMenuItemSublabel>
                  using {wallet.providerInfo.shortName}
                </TransactionAddonMenuItemSublabel>
              </>
            </TransactionAddonMenuItemBody>
            <TransactionAddonMenuItemBalance>
              <strong>{Number(walletInfo.eosBalance).toFixed(4)}</strong>{' '}
              <small>EOS</small>
            </TransactionAddonMenuItemBalance>
          </>
        )}
      </TransactionAddonMenuItemRoot>
    );
  }
}

export default TransactionAddonMenuItem;
