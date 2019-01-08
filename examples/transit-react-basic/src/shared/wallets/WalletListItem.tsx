import React, { Component, ComponentType } from 'react';
import styled from 'react-emotion';
import { WalletProvider, Wallet, WalletState } from 'eos-transit';
import { IoMdClose, IoIosLogOut } from 'react-icons/io';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { WalletListItemProgress } from './WalletListItemProgress';
import { WalletListItemStatus } from './WalletListItemStatus';
import { WalletListItemInfo } from './WalletListItemInfo';
import { WalletProviderIcon } from './WalletProviderIcon';

// Visual components

interface WalletListItemStyleProps {
  large?: boolean;
}

interface WalletListItemRootProps extends WalletListItemStyleProps {
  active?: boolean;
  hasError?: boolean;
}

// TODO: Connected backgroundColor: '#2b5a65'

const WalletListItemRoot = styled('div')(
  {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#2e3542',
    borderRadius: 1,
    transition: 'all 0.2s',

    '&:not(:last-child)': {
      marginBottom: 5
    }
  },
  ({ large, active, hasError }: WalletListItemRootProps) => {
    // TODO: Organize this mess better
    const style = {};

    if (large) {
      Object.assign(style, {
        '&:not(:last-child)': {
          marginBottom: 15
        }
      });
    }

    if (hasError) {
      Object.assign(
        style,
        {
          backgroundColor: '#582a30'
        },
        (active && {
          '&:hover': {
            backgroundColor: '#802e38',
            cursor: 'pointer'
          }
        }) ||
          void 0
      );
    } else if (active) {
      Object.assign(style, {
        '&:hover': {
          backgroundColor: '#40495a',
          cursor: 'pointer'
        },

        '&:active': {
          backgroundColor: '#3a576b'
        }
      });
    }

    return style;
  }
);

const WalletListItemContent = styled('div')({
  flex: 1,
  display: 'flex'
});

interface WalletListItemIconProps extends WalletListItemStyleProps {
  hasError?: boolean;
}

const WalletListItemIcon = styled('div')(
  ({ large, hasError }: WalletListItemIconProps) => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: large ? 80 : 50,
    padding: large ? 18 : 13,
    fontSize: large ? 30 : 20,
    color: hasError ? '#d42543' : '#26c5df'
  })
);

const WalletListItemBody = styled('div')(
  ({ large }: WalletListItemStyleProps) => ({
    flex: 1,
    padding: large ? '22px 22px 22px 0' : '13px 13px 12px 0'
  })
);

const WalletListItemBodyTop = styled('div')({
  display: 'flex'
});

const WalletListItemBodyTopMain = styled('div')({
  flex: 1
});

const WalletListItemBodyTopActions = styled('div')({
  paddingLeft: 10
});

const WalletListItemTitle = styled('div')(
  ({ large }: WalletListItemStyleProps) => ({
    padding: 0,
    paddingTop: 2,
    fontSize: large ? 16 : 14,
    color: 'white',

    '&:not(:last-child)': {
      marginBottom: large ? 8 : 6
    }
  })
);

const WalletListItemLabel = styled('div')(
  ({ large }: WalletListItemStyleProps) => ({
    fontSize: large ? 16 : 12,
    color: 'rgba(255, 255, 255, 0.4)'
  })
);

export const WalletListItemConnectButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  border: 'none',
  borderRadius: 1,
  padding: '8px 20px',
  fontSize: 11,
  fontWeight: 300,
  textAlign: 'center',
  backgroundColor: '#98243f',
  color: 'white',
  textTransform: 'uppercase',
  outline: 'none',
  transition: 'all 0.2s',

  '&:last-child': {
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1
  },

  '&:hover': {
    // backgroundColor: '#2e3542',
    backgroundColor: '#ab2847',
    color: 'white',
    cursor: 'pointer'
  },

  '&:active': {
    // backgroundColor: '#2e3542',
    backgroundColor: '#c3173f'
  }
});

export const WalletListItemDismissButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 19,
  height: 19,
  border: 'none',
  borderRadius: 1,
  padding: 0,
  fontSize: 19,
  fontWeight: 300,
  lineHeight: 1,
  textAlign: 'center',
  // backgroundColor: '#98243f',
  backgroundColor: 'transparent',
  color: 'white',
  opacity: 0.5,
  outline: 'none',
  transition: 'all 0.2s',

  '&:hover': {
    // backgroundColor: '#2e3542',
    // backgroundColor: '#ab2847',
    color: 'white',
    opacity: 1,
    cursor: 'pointer'
  },

  '&:active': {
    // backgroundColor: '#2e3542',
    // backgroundColor: '#c3173f'
  }
});

// Exported / behavior component

export interface WalletListItemData {
  id: string;
  name: string;
  description: string;
}

export interface WalletListItemProps {
  walletProvider: WalletProvider;
  wallet?: Wallet;
  iconComponent?: ComponentType;
  hasError?: boolean;
  large?: boolean;
  dismissable?: boolean;
  onConnect?: () => void;
  onLogin?: (accountName: string) => void; // ???
  onSelect?: (walletProvider: WalletProvider) => void;
  onReconnectClick?: (wallet: Wallet) => void;
  onDismissClick?: (wallet: Wallet) => void;
  onLogoutClick?: (wallet: Wallet) => void;
}

export class WalletListItem extends Component<WalletListItemProps> {
  handleSelect = () => {
    const { isSelectable } = this;
    if (!isSelectable()) return;

    const { onSelect, walletProvider } = this.props;
    if (typeof onSelect === 'function') {
      onSelect(walletProvider);
    }
  };

  handleReconnectClick = () => {
    const { onReconnectClick, wallet } = this.props;
    if (wallet && typeof onReconnectClick === 'function') {
      onReconnectClick(wallet);
    }
  };

  handleLogoutClick = () => {
    const { onLogoutClick, wallet } = this.props;
    if (wallet && typeof onLogoutClick === 'function') {
      onLogoutClick(wallet);
    }
  };

  handleDismissClick = () => {
    const { onDismissClick, wallet } = this.props;
    if (wallet && typeof onDismissClick === 'function') {
      onDismissClick(wallet);
    }
  };

  isSelectable = () => {
    const { wallet } = this.props;
    return !wallet;
  };

  render() {
    const { large, dismissable } = this.props;
    const {
      isSelectable,
      handleSelect,
      handleReconnectClick,
      handleDismissClick,
      handleLogoutClick
    } = this;
    const { walletProvider, wallet } = this.props;
    // Note: Temp hackery
    const walletState: WalletState = (wallet && wallet.state) || {};
    const { accountInfo } = walletState;
    const hasError = (wallet && wallet.hasError) || false;
    const inProgress = (wallet && wallet.inProgress) || false;
    const active = (wallet && wallet.active) || false;

    const providerName = walletProvider.meta && walletProvider.meta.name;

    const IconComponent = this.props.iconComponent;
    const icon = inProgress ? (
      <SpinnerIcon size={large ? 26 : 24} />
    ) : IconComponent ? (
      <IconComponent />
    ) : (
      <WalletProviderIcon providerId={walletProvider.id} />
    );

    return (
      <WalletListItemRoot
        hasError={hasError}
        active={isSelectable()}
        large={large}
        onClick={handleSelect}
      >
        <WalletListItemContent>
          <WalletListItemIcon hasError={hasError} large={large}>
            {icon}
          </WalletListItemIcon>

          <WalletListItemBody large={large}>
            <WalletListItemBodyTop>
              <WalletListItemBodyTopMain>
                <WalletListItemTitle large={large}>
                  {providerName}
                </WalletListItemTitle>
                <WalletListItemStatus
                  walletProvider={walletProvider}
                  wallet={wallet}
                  large={large}
                />
              </WalletListItemBodyTopMain>
              {dismissable !== false && (
                <>
                  {active && (
                    <WalletListItemBodyTopActions>
                      <WalletListItemDismissButton onClick={handleLogoutClick}>
                        <IoIosLogOut />
                      </WalletListItemDismissButton>
                    </WalletListItemBodyTopActions>
                  )}
                  {hasError && (
                    <WalletListItemBodyTopActions>
                      <WalletListItemDismissButton onClick={handleDismissClick}>
                        <IoMdClose />
                      </WalletListItemDismissButton>
                    </WalletListItemBodyTopActions>
                  )}
                </>
              )}
            </WalletListItemBodyTop>
            {accountInfo && (
              <WalletListItemInfo accountInfo={accountInfo} compact={true} />
            )}
          </WalletListItemBody>
        </WalletListItemContent>

        <WalletListItemProgress active={inProgress} indeterminate={true} />
        {hasError && (
          <WalletListItemConnectButton onClick={handleReconnectClick}>
            Reconnect
          </WalletListItemConnectButton>
        )}
      </WalletListItemRoot>
    );
  }
}

export default WalletListItem;
