import React from 'react';
import styled, { keyframes } from 'react-emotion';

const spinAnimation = keyframes({
  '0%': { transform: `rotate(0deg)` },
  '100%': { transform: `rotate(359deg)` }
});

export interface SpinnerIconProps {
  size: number;
}

export const SpinnerIconRoot = styled('div')(
  {
    display: 'inline-flex',

    '&:after': {
      content: '" "',
      display: 'block',
      margin: 1,
      borderRadius: '50%',
      border: '2px solid #fff',
      borderColor: '#fff transparent #fff transparent',
      animation: `${spinAnimation} 1.2s infinite linear`
    }
  },
  ({ size }: SpinnerIconProps) => ({
    '&:after': {
      width: size,
      height: size
    },

    '&:not(:last-child)': {
      marginRight: size / 2
    }
  })
);

export function SpinnerIcon({ size }: Partial<SpinnerIconProps>) {
  return <SpinnerIconRoot size={size || 16} />;
}

export default SpinnerIcon;
