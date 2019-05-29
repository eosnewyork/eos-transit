import React from 'react';
import {
  Dropdown,
  DropdownContainer,
  DropdownContent
} from '../shared/dropdown';
import UserMedia from './UserMedia';
import { UserMenu } from './UserMenu';

export interface UserDropdownProps {
  username?: string;
}

export function UserDropdown({ username }: UserDropdownProps) {
  return (
    <Dropdown>
      {({ isExpanded, toggle }: any) => (
        <DropdownContainer>
          <UserMedia
            caret={true}
            isActive={isExpanded}
            isAnonymous={!username}
            onClick={toggle}
            username={username || 'unknown'}
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
