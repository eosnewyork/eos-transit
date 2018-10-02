import React, { Component, ComponentType } from 'react';
import styled from 'react-emotion';
import { IoIosLock } from 'react-icons/io';
import { SpinnerIcon } from '../icons/SpinnerIcon';

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
            backgroundColor: '#582a30',

            '&:hover': {
              backgroundColor: '#802e38',
              cursor: 'pointer'
            }
          }
        : {
            backgroundColor: '#582a30'
          };
    }

    if (!disabled) {
      return {
        '&:hover': {
          backgroundColor: '#40495a',
          cursor: 'pointer'
        }
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
  padding: '15px 20px 12px 0'
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

const WalletListItemStatusLabel = styled('div')({
  fontSize: 12,
  color: '#26c5df'
});

interface WalletListItemProgressProps {
  active?: boolean;
}

const WalletListItemProgress = styled('div')(
  {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'stretch',
    height: 2,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    overflow: 'hidden',
    transform: 'scaleY(0)',
    transition: 'all 0.2s'
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

interface WalletListItemProgressBarProps {
  percentComplete?: number;
}

const WalletListItemProgressBar = styled('div')(
  {
    height: 2,
    backgroundColor: '#26c5df',
    transition: 'all 0.1s'
  },
  ({ percentComplete }: WalletListItemProgressBarProps) => ({
    width: `${percentComplete}%`
  })
);

// Exported / behavior component

export interface WalletListItemData {
  id: string;
  name: string;
  description: string;
}

export interface WalletListItemProps {
  data: WalletListItemData;
  iconComponent?: ComponentType;
  isConnecting?: boolean;
  hasError?: boolean;
  onConnect?: () => void;
  onLogin?: (accountName: string) => void;
}

export class WalletListItem extends Component<WalletListItemProps> {
  render() {
    const { props } = this;
    const { data, isConnecting, hasError } = props;
    const IconComponent = props.iconComponent || IoIosLock;
    const icon = isConnecting ? <SpinnerIcon size={24} /> : <IconComponent />;

    return (
      <WalletListItemRoot hasError={hasError} disabled={isConnecting}>
        <WalletListItemContent>
          <WalletListItemIcon hasError={hasError}>
            {icon}
          </WalletListItemIcon>

          <WalletListItemBody>
            <WalletListItemTitle>{data.name}</WalletListItemTitle>
            <WalletListItemStatusLabel>Connected</WalletListItemStatusLabel>

            {/* <WalletListItemLabel>
              {isConnecting
                ? 'Connecting to the wallet, please stand by...'
                : hasError
                  ? 'Error connecting to the wallet. Please click to try again.'
                  : data.description}
            </WalletListItemLabel> */}
          </WalletListItemBody>
        </WalletListItemContent>
        <WalletListItemProgress active={isConnecting}>
          <WalletListItemProgressBar percentComplete={75} />
        </WalletListItemProgress>
      </WalletListItemRoot>
    );
  }
}

export default WalletListItem;
