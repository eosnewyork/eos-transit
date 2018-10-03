import React from 'react';
import styled from 'react-emotion';
import { UserWalletList } from './UserWalletList';
import { UserMenuLogoutButton } from './UserMenuLogoutButton';

// Visual components

const UserMenuRoot = styled('div')({
  padding: '15px',
  width: 350
});

const UserMenuSection = styled('section')({});

const UserMenuSectionHeading = styled('div')({
  padding: '8px 0',
  fontSize: 11,
  fontWeight: 300,
  textTransform: 'uppercase'
});

// Exported / behavior components

// tslint:disable-next-line:no-empty-interface
export interface UserMenuProps {
  // TODO
}

export function UserMenu({  }: UserMenuProps) {
  return (
    <UserMenuRoot>
      <UserMenuSection>
        <UserMenuSectionHeading>My Wallets</UserMenuSectionHeading>
        <UserWalletList />
        <UserMenuLogoutButton />
      </UserMenuSection>
    </UserMenuRoot>
  );
}

export default UserMenu;
