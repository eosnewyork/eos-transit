import React, { ReactNode } from 'react';
import { Subscribe } from 'unstated';
import { UserDropdown } from './UserDropdown';
import { SessionStateContainer } from './SessionStateContainer';

export interface UserBlockProps {
  children?: ReactNode;
  username?: string;
}

export function UserBlock({ children, username }: UserBlockProps) {
  return <UserDropdown username={username} />;
}

export function UserBlockConnected({ children }: UserBlockProps) {
  return (
    <Subscribe to={[SessionStateContainer]}>
      {(sessionStateContainer: SessionStateContainer) => {
        if (!sessionStateContainer.isLoggedIn()) return null;

        const accountInfo = sessionStateContainer.getDefaultAccountInfo();
        const username =
          (accountInfo && `${accountInfo.name}@${'active'}`) || void 0;

        return <UserBlock username={username}>{children}</UserBlock>;
      }}
    </Subscribe>
  );
}

export default UserBlockConnected;
