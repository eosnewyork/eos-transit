import React, { Component, ComponentType } from 'react';
import styled from 'react-emotion';
import { IoIosLock } from 'react-icons/io';
import { SpinnerIcon } from '../shared/icons/SpinnerIcon';

// Visual components

interface WalletSelectItemRootProps {
  disabled?: boolean;
  hasError?: boolean;
}

const WalletSelectItemRoot = styled('div')(
  {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#2e3542',
    borderRadius: 2,
    transition: 'all 0.2s',

    '&:not(:last-child)': {
      marginBottom: 15
    }
  },
  ({ disabled, hasError }: WalletSelectItemRootProps) => {
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

const WalletSelectItemContent = styled('div')({
  flex: 1,
  display: 'flex'
});

interface WalletSelectItemIconProps {
  hasError?: boolean;
}

const WalletSelectItemIcon = styled('div')(
  ({ hasError }: WalletSelectItemIconProps) => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 80,
    padding: 18,
    fontSize: 30,
    color: hasError ? '#d42543' : '#26c5df'
  })
);

const WalletSelectItemBody = styled('div')({
  padding: '22px 30px 20px 0'
});

const WalletSelectItemTitle = styled('div')({
  padding: 0,
  fontSize: 16,
  color: 'white',

  '&:not(:last-child)': {
    marginBottom: 8
  }
});

const WalletSelectItemLabel = styled('div')({
  fontSize: 13,
  color: 'rgba(255, 255, 255, 0.5)'
});

interface WalletSelectItemProgressProps {
  active?: boolean;
}

const WalletSelectItemProgress = styled('div')(
  {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'stretch',
    height: 2,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    overflow: 'hidden',
    transform: 'scaleY(0)',
    transition: 'all 0.2s'
  },
  ({ active }: WalletSelectItemProgressProps) => {
    if (active) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transform: 'scaleY(1)'
      };
    }

    return {};
  }
);

interface WalletSelectItemProgressBarProps {
  percentComplete?: number;
}

const WalletSelectItemProgressBar = styled('div')(
  {
    height: 2,
    backgroundColor: '#26c5df',
    transition: 'all 0.1s'
  },
  ({ percentComplete }: WalletSelectItemProgressBarProps) => ({
    width: `${percentComplete}%`
  })
);

// Exported / behavior component

export interface WalletSelectItemData {
  id: string;
  name: string;
  description: string;
}

export interface WalletSelectItemProps {
  data: WalletSelectItemData;
  iconComponent?: ComponentType;
  isConnecting?: boolean;
  hasError?: boolean;
  onConnect?: () => void;
  onLogin?: (accountName: string) => void;
}

export class WalletSelectItem extends Component<WalletSelectItemProps> {
  render() {
    const { props } = this;
    const { data, isConnecting, hasError } = props;
    const IconComponent = props.iconComponent || IoIosLock;
    const icon = isConnecting ? <SpinnerIcon size={30} /> : <IconComponent />;

    return (
      <WalletSelectItemRoot hasError={hasError} disabled={isConnecting}>
        <WalletSelectItemContent>
          <WalletSelectItemIcon hasError={hasError}>
            {icon}
          </WalletSelectItemIcon>

          <WalletSelectItemBody>
            <WalletSelectItemTitle>{data.name}</WalletSelectItemTitle>
            <WalletSelectItemLabel>
              {isConnecting
                ? 'Connecting to the wallet, please stand by...'
                : hasError
                  ? 'Error connecting to the wallet. Please click to try again.'
                  : data.description}
            </WalletSelectItemLabel>
          </WalletSelectItemBody>
        </WalletSelectItemContent>
        <WalletSelectItemProgress active={isConnecting}>
          <WalletSelectItemProgressBar percentComplete={75} />
        </WalletSelectItemProgress>
      </WalletSelectItemRoot>
    );
  }
}

export default WalletSelectItem;
