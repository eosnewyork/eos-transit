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

        const walletInfo = sessionStateContainer.getDefaultWalletInfo();
        const username =
          (walletInfo &&
            `${walletInfo.accountName}@${walletInfo.accountAuthority}`) ||
          void 0;

        return <UserBlock username={username}>{children}</UserBlock>;
      }}
    </Subscribe>
  );
}

export default UserBlockConnected;
