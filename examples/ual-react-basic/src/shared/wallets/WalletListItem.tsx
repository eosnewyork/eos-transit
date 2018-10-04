import React, { Component, ComponentType } from 'react';
import styled, { keyframes } from 'react-emotion';
import { IoIosLock, IoMdClose, IoIosLogOut } from 'react-icons/io';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { WalletModel, WalletConnectionStatus } from './types';
import { WalletListItemInfo } from './WalletListItemInfo';

// Visual components

interface WalletListItemRootProps {
  disabled?: boolean;
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
  ({ disabled, hasError }: WalletListItemRootProps) => {
    // TODO: Organize this mess better
    if (hasError) {
      return !disabled
        ? {
            backgroundColor: '#582a30'

            // '&:hover': {
            //   backgroundColor: '#802e38',
            //   cursor: 'pointer'
            // }
          }
        : {
            backgroundColor: '#582a30'
          };
    }

    if (!disabled) {
      return {
        // '&:hover': {
        //   backgroundColor: '#40495a',
        //   cursor: 'pointer'
        // }
      };
    }

    return {};
  }
);

const WalletListItemContent = styled('div')({
  flex: 1,
  display: 'flex'
});

interface WalletListItemIconProps {
  hasError?: boolean;
}

const WalletListItemIcon = styled('div')(
  ({ hasError }: WalletListItemIconProps) => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 50,
    padding: 13,
    fontSize: 20,
    color: hasError ? '#d42543' : '#26c5df'
  })
);

const WalletListItemBody = styled('div')({
  flex: 1,
  padding: '13px 13px 12px 0'
});

const WalletListItemBodyTop = styled('div')({
  display: 'flex'
});

const WalletListItemBodyTopMain = styled('div')({
  flex: 1
});

const WalletListItemBodyTopActions = styled('div')({
  paddingLeft: 10
});

const WalletListItemTitle = styled('div')({
  padding: 0,
  paddingTop: 2,
  fontSize: 14,
  color: 'white',

  '&:not(:last-child)': {
    marginBottom: 4
  }
});

const WalletListItemLabel = styled('div')({
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.5)'
});

interface WalletListItemStatusLabelProps {
  success?: boolean;
  error?: boolean;
}

const WalletListItemStatusLabel = styled('div')(
  {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  ({ success, error }: WalletListItemStatusLabelProps) => {
    if (error) return { color: '#e84a75' };
    if (success) return { color: '#26c5df' };
    return {};
  }
);

interface WalletListItemProgressProps {
  active?: boolean;
}

const WalletListItemProgress = styled('div')(
  {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'stretch',
    height: 2,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    transform: 'scaleY(0)',
    transition: 'all 0.2s',

    '&:last-child': {
      borderBottomLeftRadius: 1,
      borderBottomRightRadius: 1
    }
  },
  ({ active }: WalletListItemProgressProps) => {
    if (active) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transform: 'scaleY(1)'
      };
    }

    return {};
  }
);

const progressIndeterminateAnimation = keyframes({
  from: { left: '-100%' },
  to: { left: '100%' }
});

interface WalletListItemProgressBarProps {
  indeterminate?: boolean;
  percentComplete?: number;
}

const WalletListItemProgressBar = styled('div')(
  {
    position: 'absolute',
    height: 2,
    backgroundColor: '#26c5df',
    transition: 'all 0.1s'
  },
  ({ indeterminate, percentComplete }: WalletListItemProgressBarProps) => {
    if (indeterminate) {
      return {
        width: '70%',
        animation: `${progressIndeterminateAnimation} 2s ease-in-out infinite`
      };
    }

    if (typeof percentComplete !== 'undefined') {
      return { width: `${percentComplete}%` };
    }

    return {};
  }
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
  data: WalletModel;
  iconComponent?: ComponentType;
  isConnecting?: boolean;
  hasError?: boolean;
  onConnect?: () => void;
  onLogin?: (accountName: string) => void;
}

function renderStatusLabel(
  connectionStatus: WalletConnectionStatus,
  username?: string
) {
  const { connecting, connected, error, errorMessage } = connectionStatus;

  return error ? (
    <WalletListItemStatusLabel error={true}>
      {errorMessage}
    </WalletListItemStatusLabel>
  ) : connected ? (
    <WalletListItemStatusLabel success={true}>
      Connected {username ? <span>as {username}</span> : null}
    </WalletListItemStatusLabel>
  ) : connecting ? (
    <WalletListItemStatusLabel>
      Connecting to wallet, please stand by...
    </WalletListItemStatusLabel>
  ) : null;
}

export class WalletListItem extends Component<WalletListItemProps> {
  render() {
    const { data } = this.props;
    const { providerInfo, walletInfo, connectionStatus } = data;
    const { connecting, connected, error, errorMessage } = connectionStatus;
    const username =
      (walletInfo &&
        `${walletInfo.accountName}@${walletInfo.accountAuthority}`) ||
      'unknown';

    const IconComponent = this.props.iconComponent || IoIosLock;
    const icon = connecting ? <SpinnerIcon size={24} /> : <IconComponent />;

    return (
      <WalletListItemRoot hasError={error} disabled={connecting}>
        <WalletListItemContent>
          <WalletListItemIcon hasError={error}>{icon}</WalletListItemIcon>

          <WalletListItemBody>
            <WalletListItemBodyTop>
              <WalletListItemBodyTopMain>
                <WalletListItemTitle>{providerInfo.name}</WalletListItemTitle>
                {renderStatusLabel(connectionStatus, username)}
              </WalletListItemBodyTopMain>
              {connected && (
                <WalletListItemBodyTopActions>
                  <WalletListItemDismissButton>
                    <IoIosLogOut />
                  </WalletListItemDismissButton>
                </WalletListItemBodyTopActions>
              )}
              {error && (
                <WalletListItemBodyTopActions>
                  <WalletListItemDismissButton>
                    <IoMdClose />
                  </WalletListItemDismissButton>
                </WalletListItemBodyTopActions>
              )}
            </WalletListItemBodyTop>
            {walletInfo && (
              <WalletListItemInfo walletInfo={walletInfo} compact={true} />
            )}
          </WalletListItemBody>
        </WalletListItemContent>
        <WalletListItemProgress active={connecting}>
          <WalletListItemProgressBar indeterminate={true} />
        </WalletListItemProgress>
        {error && (
          <WalletListItemConnectButton>Connect</WalletListItemConnectButton>
        )}
      </WalletListItemRoot>
    );
  }
}

export default WalletListItem;
