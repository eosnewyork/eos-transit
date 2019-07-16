import React, { ReactNode } from 'react';
import WAL from 'eos-transit';
import { UserDropdown } from './UserDropdown';

const { accessContext } = WAL;

export interface UserBlockProps {
  children?: ReactNode;
  username?: string;
}

export function UserBlock({ children, username }: UserBlockProps) {
  return <UserDropdown username={username} />;
}

export function UserBlockConnected({ children }: UserBlockProps) {
  const isLoggedIn = !!accessContext.getActiveWallets().length;
  if (!isLoggedIn) return null;

  const auth = accessContext.getActiveWallets()[0].auth;
  const username = (auth && `${auth.accountName}@${auth.permission}`) || void 0;

  return <UserBlock username={username}>{children}</UserBlock>;
}

export default UserBlockConnected;
