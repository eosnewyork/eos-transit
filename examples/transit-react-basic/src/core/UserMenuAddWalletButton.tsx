import React from 'react';
import styled from 'react-emotion';
import { IoIosAddCircleOutline } from 'react-icons/io';

export interface UserMenuAddWalletButtonProps {
  onClick?: (event: any) => void;
}

export const UserMenuAddWalletButtonRoot = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  border: '1px dashed #424a56',
  borderRadius: 1,
  fontSize: 14,
  backgroundColor: '#20252f',
  color: 'white',
  textAlign: 'center',
  outline: 'none',
  transition: 'all 0.2s',

  '&:hover': {
    backgroundColor: '#2e3542',
    color: 'white',
    cursor: 'pointer',
    borderColor: '#346f77'
  },

  '&:active': {
    backgroundColor: '#26c5df',
    borderColor: 'transparent'
  }
});

const iconWidth = 50;

export const UserMenuAddWalletButtonText = styled('div')({
  flex: 1,
  padding: `13px ${iconWidth + 13}px 13px 0`,
  textAlign: 'center'
});

export const UserMenuAddWalletButtonIcon = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: iconWidth,
  padding: 13,
  fontSize: 24,
  opacity: 0.5
});

export function UserMenuAddWalletButton({
  onClick
}: UserMenuAddWalletButtonProps) {
  return (
    <UserMenuAddWalletButtonRoot onClick={onClick}>
      <UserMenuAddWalletButtonIcon>
        <IoIosAddCircleOutline />
      </UserMenuAddWalletButtonIcon>

      <UserMenuAddWalletButtonText>Add Wallet</UserMenuAddWalletButtonText>
    </UserMenuAddWalletButtonRoot>
  );
}

export default UserMenuAddWalletButton;
