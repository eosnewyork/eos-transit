import React from 'react';
import styled from 'react-emotion';
import { WalletAccessSession, WalletProvider } from 'wal-eos';

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

// Helpers

function renderProviderDescription(
  walletProvider: WalletProvider,
  large?: boolean
) {
  const providerDescription =
    walletProvider.meta && walletProvider.meta.description;
  return (
    <WalletListItemStatusLabel large={large}>
      {providerDescription}
    </WalletListItemStatusLabel>
  );
}

// Exported components

interface WalletListItemStatusProps {
  walletProvider: WalletProvider;
  walletAccessSession?: WalletAccessSession;
  large?: boolean;
}

export function WalletListItemStatus({
  walletAccessSession,
  walletProvider,
  large
}: WalletListItemStatusProps) {
  if (!walletAccessSession) {
    return renderProviderDescription(walletProvider, large);
  }

  const {
    hasError,
    errorMessage,
    inProgress,
    active,
    accountInfo
  } = walletAccessSession;

  const username =
    (accountInfo && `${accountInfo.name}@${'active'}`) || 'unknown';

  return hasError ? (
    <WalletListItemStatusLabel error={true} large={large}>
      {errorMessage}
    </WalletListItemStatusLabel>
  ) : active ? (
    <WalletListItemStatusLabel success={true} large={large}>
      Connected {username ? <span>as {username}</span> : null}
    </WalletListItemStatusLabel>
  ) : inProgress ? (
    <WalletListItemStatusLabel large={large}>
      Connecting to wallet, please stand by...
    </WalletListItemStatusLabel>
  ) : (
    renderProviderDescription(walletProvider, large)
  );
}

export default WalletListItemStatus;
