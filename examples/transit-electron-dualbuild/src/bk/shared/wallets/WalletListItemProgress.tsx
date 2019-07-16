import React from 'react';
import styled, { keyframes } from 'react-emotion';

// Note: Nice success color: #00ca7a

// Visual components

interface WalletListItemProgressRootProps {
  active?: boolean;
}

const WalletListItemProgressRoot = styled('div')(
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
  ({ active }: WalletListItemProgressRootProps) => {
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

// Exported components

interface WalletListItemProgressProps {
  active?: boolean;
  indeterminate?: boolean;
  percentComplete?: number;
}

export function WalletListItemProgress({
  active,
  indeterminate,
  percentComplete
}: WalletListItemProgressProps) {
  return (
    <WalletListItemProgressRoot active={active}>
      <WalletListItemProgressBar
        indeterminate={indeterminate}
        percentComplete={percentComplete}
      />
    </WalletListItemProgressRoot>
  );
}

export default WalletListItemProgress;
