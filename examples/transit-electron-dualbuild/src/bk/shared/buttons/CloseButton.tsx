import React from 'react';
import styled from 'react-emotion';
import { IoIosClose } from 'react-icons/io';

export interface CloseButtonProps {
  onClick?: (event: any) => void;
  size: number;
}

export const CloseButtonRoot = styled('div')(
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    color: 'white',
    transition: 'all 0.2s',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.07)',
      color: '#26c5de',
      cursor: 'pointer'
    }
  },
  ({ size }: CloseButtonProps) => ({
    width: size,
    height: size,
    fontSize: size * 0.8,

    '&:not(:last-child)': {
      marginRight: size / 4
    }
  })
);

export function CloseButton({ onClick, size }: Partial<CloseButtonProps>) {
  return (
    <CloseButtonRoot size={size || 24} onClick={onClick}>
      <IoIosClose />
    </CloseButtonRoot>
  );
}

export default CloseButton;
