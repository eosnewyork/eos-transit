import React, { Component } from 'react';
import styled from 'react-emotion';
import { WalletAccessSession } from 'wal-eos';
import { WalletProviderIcon } from '../wallets/WalletProviderIcon';

// Visual components

const TransactionAddonMenuItemRoot = styled('div')({
  display: 'flex',
  width: '100%',
  // padding: '10px 10px',
  fontSize: 12,
  borderRadius: 1,
  backgroundColor: '#2e3542',
  transition: 'all 0.2s',

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
  walletSession: WalletAccessSession;
  onSelect?: (walletSession: WalletAccessSession) => void;
}

export class TransactionAddonMenuItem extends Component<
  TransactionAddonMenuItemProps
> {
  handleClick = () => {
    const { onSelect, walletSession } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(walletSession);
    }
  };
  render() {
    const { handleClick } = this;
    const { walletSession } = this.props;
    const { accountInfo } = walletSession;

    return (
      <TransactionAddonMenuItemRoot onClick={handleClick}>
        <TransactionAddonMenuItemIcon>
          <WalletProviderIcon providerId={walletSession.provider.id} />
        </TransactionAddonMenuItemIcon>

        {accountInfo && (
          <>
            <TransactionAddonMenuItemBody>
              <>
                <TransactionAddonMenuItemLabel>
                  {accountInfo.name}@{'active'}
                </TransactionAddonMenuItemLabel>
                {walletSession.provider.meta &&
                  walletSession.provider.meta.shortName && (
                    <TransactionAddonMenuItemSublabel>
                      using {walletSession.provider.meta.shortName}
                    </TransactionAddonMenuItemSublabel>
                  )}
              </>
            </TransactionAddonMenuItemBody>
            <TransactionAddonMenuItemBalance>
              <strong>
                {Number(accountInfo.core_liquid_balance).toFixed(4)}
              </strong>{' '}
              <small>EOS</small>
            </TransactionAddonMenuItemBalance>
          </>
        )}
      </TransactionAddonMenuItemRoot>
    );
  }
}

export default TransactionAddonMenuItem;
