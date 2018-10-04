import React from 'react';
import styled from 'react-emotion';
import { WalletConnectionStatus } from './types';

// Visual components

interface WalletListItemStatusLabelProps {
  success?: boolean;
  error?: boolean;
}

const WalletListItemStatusLabel = styled('div')(
  {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  ({ success, error }: WalletListItemStatusLabelProps) => {
    if (error) return { color: '#e84a75' };
    if (success) return { color: '#26c5df' };
    return {};
  }
);

// Exported components

interface WalletListItemStatusProps {
  connectionStatus: WalletConnectionStatus;
  username?: string;
}

export function WalletListItemStatus({
  connectionStatus,
  username
}: WalletListItemStatusProps) {
  const { connecting, connected, error, errorMessage } = connectionStatus;

  return error ? (
    <WalletListItemStatusLabel error={true}>
      {errorMessage}
    </WalletListItemStatusLabel>
  ) : connected ? (
    <WalletListItemStatusLabel success={true}>
      Connected {username ? <span>as {username}</span> : null}
    </WalletListItemStatusLabel>
  ) : connecting ? (
    <WalletListItemStatusLabel>
      Connecting to wallet, please stand by...
    </WalletListItemStatusLabel>
  ) : null;
}

export default WalletListItemStatus;
