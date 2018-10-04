import { Container } from 'unstated';
import { WalletModel } from '../shared/wallets/types';

export interface SessionState {
  activeWallets: WalletModel[];
  // availableWallets: WalletModel[];
}

const walletProviders = [
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

const activeWallets = [
  {
    providerInfo: {
      id: 'scatter-desktop',
      name: 'Scatter Desktop',
      description:
        'Scatter Desktop application that keeps your private keys secure'
    },
    connectionStatus: {
      connected: true
    },
    walletInfo: {
      accountName: 'bob123451234',
      accountAuthority: 'active',
      eosBalance: 99963.0,
      ram: 1020241, // Kb
      cpu: 10793253535, // ms
      net: 56587736535 // KiB
    }
  },
  {
    providerInfo: {
      id: 'paste-the-private-key',
      name: 'Paste-The-Private-Key™',
      description:
        'Forget about security and just paste your private key directly to sign your transactions'
    },
    connectionStatus: {
      connected: false,
      error: true,
      errorMessage: 'Connection error, please try again'
    }
  },
  {
    providerInfo: {
      id: 'eos-metro',
      name: 'METRO™ Hardware Wallet',
      description:
        'Use secure hardware private key vault to sign your transactions'
    },
    connectionStatus: {
      connected: false,
      connecting: true
    }
  }
];

// const availableWallets = [
//   {
//     providerInfo: {
//       id: 'paste-the-private-key',
//       name: 'Paste-The-Private-Key™',
//       description:
//         'Forget about security and just paste your private key directly to sign your transactions'
//     },
//     connectionStatus: {
//       connected: false
//     }
//   },
//   {
//     providerInfo: {
//       id: 'eos-metro',
//       name: 'METRO™ Hardware Wallet',
//       description:
//         'Use secure hardware private key vault to sign your transactions'
//     },
//     connectionStatus: {
//       connected: false
//     }
//   }
// ];

export const DEFAULT_SESSION_STATE = {
  activeWallets,
  // availableWallets
};

export class SessionStateContainer extends Container<SessionState> {
  constructor() {
    super();
    this.state = DEFAULT_SESSION_STATE;

    // TODO: Implement some session persistence
    // this.state = this.sessionStateStorage.load() || DEFAULT_SESSION_STATE;
  }

  getActiveWallets() {
    return this.state.activeWallets;
  }

  getAvailableWallets() {
    const activeWalletProviderIds = this.state.activeWallets.map(
      w => w.providerInfo.id
    );

    return walletProviders
      .filter(walletProvider =>
        !activeWalletProviderIds.includes(walletProvider.id)
      )
      .map(providerInfo => ({
        providerInfo,
        connectionStatus: { connected: false }
      }));
  }

  addWallet = (wallet: WalletModel) => {
    this.state.activeWallets = [...this.state.activeWallets, wallet];
  };

  dismissWallet = (wallet: WalletModel) => {
    this.state.activeWallets = this.state.activeWallets.filter(
      w => w.providerInfo.id !== wallet.providerInfo.id
    );
  };

  logoutWallet = (wallet: WalletModel) => {
    // TODO: Logout, then just remove
    return this.dismissWallet(wallet);
  };

  getWalletInfo = (providerId: string) => {
    // TODO
  };

  getUserInfo = (sessionState: SessionState) => {
    // TODO
  };

  async logout() {
    // TODO: Logout all wallets and destroy the entire session
  }
}

export default SessionStateContainer;
