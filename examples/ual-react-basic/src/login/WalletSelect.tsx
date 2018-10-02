import React, { Component } from 'react';
import styled from 'react-emotion';
import WalletSelectItem, { WalletSelectItemData } from './WalletSelectItem';

// Visual components
// TODO: Extract to `shared`

const WalletSelectList = styled('div')({
  width: '100%'
});

// Exported component

export interface WalletSelectProps {
  onWalletSelect?: (selectedWallet: any) => void;
}

const walletProvidersInProgress = {
  'scatter-desktop': true
};

const walletProvidersWithError = {
  'paste-the-private-key': true
};

// TEMP
function isWalletConnecting(walletProviderId: string) {
  return !!walletProvidersInProgress[walletProviderId];
}

function walletHasError(walletProviderId: string) {
  return !!walletProvidersWithError[walletProviderId];
}

export class WalletSelect extends Component<WalletSelectProps> {
  render() {
    const { props } = this;

    // TODO: Pass from outside
    const walletProviders: WalletSelectItemData[] = [
      {
        id: 'scatter-desktop',
        name: 'Scatter Desktop',
        description:
          'Scatter Desktop application that keeps your private keys secure'
      },
      {
        id: 'paste-the-private-key',
        name: 'Paste-The-Private-Key™',
        description:
          'Forget about security and just paste your private key directly to sign your transactions'
      },
      {
        id: 'eos-metro',
        name: 'METRO™ Hardware Wallet',
        description:
          'Use secure hardware private key vault to sign your transactions'
      }
    ];

    return (
      <WalletSelectList>
        {walletProviders.map(wallet => (
          <WalletSelectItem
            key={wallet.id}
            data={wallet}
            isConnecting={isWalletConnecting(wallet.id)}
            hasError={walletHasError(wallet.id)}
          />
        ))}
      </WalletSelectList>
    );
  }
}

export default WalletSelect;
