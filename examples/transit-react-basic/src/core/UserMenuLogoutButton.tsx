import React from 'react';
import styled from 'react-emotion';
import WAL from 'eos-transit';
import { IoIosLogOut } from 'react-icons/io';

const { accessContext } = WAL;

export interface UserMenuLogoutButtonProps {
  onClick?: (event: any) => void;
}

export const UserMenuLogoutButtonRoot = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  border: 'none',
  borderRadius: 1,
  padding: '10px 20px',
  fontSize: 14,
  backgroundColor: '#20252f',
  color: 'white',
  textAlign: 'center',
  outline: 'none',
  transition: 'all 0.2s',

  '&:hover': {
    // backgroundColor: '#2e3542',
    backgroundColor: '#98243f',
    color: 'white',
    cursor: 'pointer'
  },

  '&:active': {
    // backgroundColor: '#2e3542',
    backgroundColor: '#c3173f'
  }
});

export const UserMenuLogoutButtonIcon = styled('div')({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 10
});

export const UserMenuLogoutButtonText = styled('div')({});

export function UserMenuLogoutButton({ onClick }: UserMenuLogoutButtonProps) {
  return (
    <UserMenuLogoutButtonRoot onClick={onClick}>
      <UserMenuLogoutButtonText>Logout</UserMenuLogoutButtonText>
      <UserMenuLogoutButtonIcon>
        <IoIosLogOut />
      </UserMenuLogoutButtonIcon>
    </UserMenuLogoutButtonRoot>
  );
}

export function UserMenuLogoutButtonConnected() {
  return <UserMenuLogoutButton onClick={() => accessContext.terminateAll()} />;
}

export default UserMenuLogoutButtonConnected;
