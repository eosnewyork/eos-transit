import React from 'react';
import styled from 'react-emotion';
import { WalletConnectionStatus } from './types';

// Visual components

interface WalletListItemStatusLabelProps {
  success?: boolean;
  error?: boolean;
  large?: boolean;
}

const WalletListItemStatusLabel = styled('div')(
  ({ large, success, error }: WalletListItemStatusLabelProps) => ({
    fontSize: large ? 13 : 11,
    color: error ? '#e84a75' : success ? '#26c5df' : 'rgba(255, 255, 255, 0.45)'
  })
);

// Exported components

interface WalletListItemStatusProps {
  connectionStatus: WalletConnectionStatus;
  username?: string;
  providerDescription?: string;
  large?: boolean;
}

export function WalletListItemStatus({
  connectionStatus,
  username,
  providerDescription,
  large
}: WalletListItemStatusProps) {
  const { connecting, connected, error, errorMessage } = connectionStatus;

  return error ? (
    <WalletListItemStatusLabel error={true} large={large}>
      {errorMessage}
    </WalletListItemStatusLabel>
  ) : connected ? (
    <WalletListItemStatusLabel success={true} large={large}>
      Connected {username ? <span>as {username}</span> : null}
    </WalletListItemStatusLabel>
  ) : connecting ? (
    <WalletListItemStatusLabel large={large}>
      Connecting to wallet, please stand by...
    </WalletListItemStatusLabel>
  ) : (
    <WalletListItemStatusLabel large={large}>
      {providerDescription}
    </WalletListItemStatusLabel>
  );
}

export default WalletListItemStatus;
