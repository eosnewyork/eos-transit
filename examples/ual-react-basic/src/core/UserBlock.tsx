import React, { ReactNode } from 'react';
import { UserDropdown } from './UserDropdown';

export interface UserBlockProps {
  children?: ReactNode;
}

export function UserBlock({ children }: UserBlockProps) {
  return (
    <UserDropdown />
  );
}

export default UserBlock;
