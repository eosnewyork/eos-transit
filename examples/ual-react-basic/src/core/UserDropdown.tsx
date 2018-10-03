import React from 'react';
import {
  Dropdown,
  DropdownContainer,
  DropdownContent
} from '../shared/dropdown';
import UserMedia from './UserMedia';
import { UserMenu } from './UserMenu';

export function UserDropdown() {
  return (
    <Dropdown>
      {({ isExpanded, toggle }) => (
        <DropdownContainer>
          <UserMedia
            caret={true}
            isActive={isExpanded}
            onClick={toggle}
            username="bob123451234"
          />

          <DropdownContent visible={isExpanded} alignRight={true}>
            <UserMenu />
          </DropdownContent>
        </DropdownContainer>
      )}
    </Dropdown>
  );
}

export default UserDropdown;
