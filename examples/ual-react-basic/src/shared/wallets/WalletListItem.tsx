import React, { Component, ComponentType } from 'react';
import styled, { keyframes } from 'react-emotion';
import { IoIosLock } from 'react-icons/io';
import { SpinnerIcon } from '../icons/SpinnerIcon';
import { WalletModel, WalletConnectionStatus, WalletInfo } from './types';

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
  padding: '15px 15px 12px 0'
});

const WalletListItemTitle = styled('div')({
  padding: 0,
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

// TODO: Extract to a separate component

export const WalletListItemWalletInfoRoot = styled('div')({
  // display: 'flex',
  // alignItems: 'flex-start',
  width: '100%',
  paddingTop: 12,
  // borderTop: '1px solid rgba(0, 0, 0, 0.2)'
});

export const WalletListItemWalletInfoMain = styled('div')({
  marginBottom: 8,
  fontSize: 14
});

export const WalletListItemWalletInfoParams = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: 8,
  paddingTop: 8,
  borderTop: '1px solid rgba(0, 0, 0, 0.2)'
});

export const WalletListItemWalletInfoParam = styled('div')({
  display: 'flex',
  alignItems: 'center',
  minWidth: 60,
  padding: '0 10px 4px 0',
  fontSize: 11
});

export const WalletListItemWalletInfoParamHeading = styled('div')({
  width: 27,
  fontSize: 9,
  fontWeight: 300,
  // color: 'rgba(255, 255, 255, 0.8)',
  color: 'white',
  textTransform: 'uppercase'
});

export const WalletListItemWalletInfoParamContent = styled('div')({
  flex: 1,
  fontSize: 11,
  fontWeight: 600,
  color: '#26c5df'
});

interface WalletListItemWalletInfoProps {
  walletInfo: WalletInfo;
}

function WalletListItemWalletInfo({
  walletInfo
}: WalletListItemWalletInfoProps) {
  return (
    <WalletListItemWalletInfoRoot>
      <WalletListItemWalletInfoMain>
        {`${walletInfo.eosBalance} EOS`}
      </WalletListItemWalletInfoMain>
      <WalletListItemWalletInfoParams>
        <WalletListItemWalletInfoParam>
          <WalletListItemWalletInfoParamHeading>
            RAM
          </WalletListItemWalletInfoParamHeading>
          <WalletListItemWalletInfoParamContent>
            {`${walletInfo.ram} Kb`}
          </WalletListItemWalletInfoParamContent>
        </WalletListItemWalletInfoParam>

        <WalletListItemWalletInfoParam>
          <WalletListItemWalletInfoParamHeading>
            CPU
          </WalletListItemWalletInfoParamHeading>
          <WalletListItemWalletInfoParamContent>
            {`${walletInfo.cpu} ms`}
          </WalletListItemWalletInfoParamContent>
        </WalletListItemWalletInfoParam>

        <WalletListItemWalletInfoParam>
          <WalletListItemWalletInfoParamHeading>
            NET
          </WalletListItemWalletInfoParamHeading>
          <WalletListItemWalletInfoParamContent>
            {`${walletInfo.net} KiB`}
          </WalletListItemWalletInfoParamContent>
        </WalletListItemWalletInfoParam>
      </WalletListItemWalletInfoParams>
    </WalletListItemWalletInfoRoot>
  );
}

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
            <WalletListItemTitle>{providerInfo.name}</WalletListItemTitle>
            {renderStatusLabel(connectionStatus, username)}
            {walletInfo && <WalletListItemWalletInfo walletInfo={walletInfo} />}
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
