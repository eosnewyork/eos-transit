import React, { Component } from 'react';
import styled from 'react-emotion';
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from 'react-icons/io';
import { MenuSectionHeaderButton } from './MenuSectionHeaderButton';
import { UserWalletList } from './UserWalletList';
import { AvailableWalletList } from './AvailableWalletList';
import UserMenuLogoutButton from './UserMenuLogoutButton';

// Visual components

const UserMenuRoot = styled('div')({
  padding: '15px',
  width: 350
});

const UserMenuSection = styled('section')({
  '&:not(:last-child)': {
    marginBottom: 15
  }
});

const UserMenuSectionHeader = styled('header')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 8,
  padding: 0
});

const UserMenuSectionHeading = styled('div')({
  flex: 1,
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

export interface UserMenuState {
  isAddWalletViewShown: boolean;
}

export class UserMenu extends Component<UserMenuProps, UserMenuState> {
  state = {
    isAddWalletViewShown: false
  };

  showAddWalletView = () => {
    this.setState(state => ({
      isAddWalletViewShown: true
    }));
  };

  showDefaultView = () => {
    this.setState(state => ({
      isAddWalletViewShown: false
    }));
  };

  render() {
    const { showAddWalletView, showDefaultView } = this;
    const { isAddWalletViewShown } = this.state;

    return (
      <UserMenuRoot>
        {!isAddWalletViewShown && (
          <>
            <UserMenuSection>
              <UserMenuSectionHeader>
                <UserMenuSectionHeading>My Wallets</UserMenuSectionHeading>
                <MenuSectionHeaderButton
                  icon={IoIosAddCircleOutline}
                  onClick={showAddWalletView}
                >
                  Add Wallet
                </MenuSectionHeaderButton>
              </UserMenuSectionHeader>
              <UserWalletList />
            </UserMenuSection>

            <UserMenuLogoutButton />
          </>
        )}

        {isAddWalletViewShown && (
          <>
            <UserMenuSectionHeader>
              <UserMenuSectionHeading>Available Wallets</UserMenuSectionHeading>
              <MenuSectionHeaderButton
                icon={IoIosCloseCircleOutline}
                iconOnly={true}
                onClick={showDefaultView}
              />
            </UserMenuSectionHeader>
            <AvailableWalletList onItemSelect={showDefaultView} />
          </>
        )}
      </UserMenuRoot>
    );
  }
}

export default UserMenu;
