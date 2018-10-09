import { Container } from 'unstated';
import { WalletModel, WalletProviderInfo } from '../shared/wallets/types';

export interface SessionState {
  activeWallets: WalletModel[];
}

const tempWalletInfo = {
  accountName: 'bob123451234',
  accountAuthority: 'active',
  eosBalance: 99963.0,
  ram: 1020241, // Kb
  cpu: 10793253535, // ms
  net: 56587736535 // KiB
};

// TODO: Will be taken from configured UAL instance directly
const walletProviders: WalletProviderInfo[] = [
  {
    id: 'scatter-desktop',
    name: 'Scatter Desktop',
    shortName: 'Scatter',
    description:
      'Scatter Desktop application that keeps your private keys secure'
  },
  {
    id: 'eos-metro',
    name: 'METRO™ Hardware Wallet',
    shortName: 'METRO™',
    description:
      'Use secure hardware private key vault to sign your transactions'
  },
  {
    id: 'paste-the-private-key',
    name: 'Paste-The-Private-Key™',
    shortName: 'Insecure Private Key',
    description:
      'Forget about security and just paste your private key directly to sign your transactions'
  }
];

const tempActiveWallets = [
  {
    providerInfo: walletProviders[0],
    connectionStatus: {
      connected: true
    },
    walletInfo: {
      ...tempWalletInfo
    }
  }
];

export const DEFAULT_SESSION_STATE = {
  activeWallets: tempActiveWallets
};

export class SessionStateContainer extends Container<SessionState> {
  constructor() {
    super();
    this.state = DEFAULT_SESSION_STATE;

    // TODO: Implement some session persistence
    // this.state = this.sessionStateStorage.load() || DEFAULT_SESSION_STATE;
  }

  isLoggedIn = () => {
    return !!this.getDefaultWalletInfo();
  };

  getWalletProviders = () => {
    return walletProviders;
  };

  getAllWallets = () => {
    return [...this.getActiveWallets(), ...this.getAvailableWallets()];
  };

  getActiveWallets = () => {
    return this.state.activeWallets;
  };

  getConnectedWallets = () => {
    return this.getActiveWallets().filter(w => w.connectionStatus.connected);
  };

  getAvailableWallets = () => {
    const activeWalletProviderIds = this.state.activeWallets.map(
      w => w.providerInfo.id
    );

    return walletProviders
      .filter(
        walletProvider => !activeWalletProviderIds.includes(walletProvider.id)
      )
      .map(providerInfo => ({
        providerInfo,
        connectionStatus: { connected: false }
      }));
  };

  isProviderAdded = (providerId: string) => {
    return (
      providerId &&
      this.getActiveWallets().some(
        wallet => wallet.providerInfo.id === providerId
      )
    );
  };

  addWallet = async (wallet: WalletModel) => {
    if (this.isProviderAdded(wallet.providerInfo.id)) return;

    await this.setState(state => ({
      activeWallets: [...state.activeWallets, wallet]
    }));

    this.connectToWallet(wallet);
  };

  dismissWallet = (wallet: WalletModel) => {
    this.setState(state => ({
      activeWallets: state.activeWallets.filter(
        w => w.providerInfo.id !== wallet.providerInfo.id
      )
    }));
  };

  connectToWallet = async (wallet: WalletModel) => {
    await this.setState(state => ({
      activeWallets: state.activeWallets.map(w => {
        if (w.providerInfo.id !== wallet.providerInfo.id) return w;
        return {
          ...w,
          connectionStatus: {
            connected: false,
            connecting: true
          }
        };
      })
    }));

    const _this = this;

    function imitateConnected() {
      return _this.setState(state => ({
        activeWallets: state.activeWallets.map(w => {
          if (w.providerInfo.id !== wallet.providerInfo.id) return w;
          return {
            ...w,
            connectionStatus: {
              connected: true,
              connecting: false
            },
            walletInfo: { ...tempWalletInfo }
          };
        })
      }));
    }

    function imitateConnectionError() {
      return _this.setState(state => ({
        activeWallets: state.activeWallets.map(w => {
          if (w.providerInfo.id !== wallet.providerInfo.id) return w;
          return {
            ...w,
            connectionStatus: {
              connected: false,
              connecting: false,
              error: true,
              errorMessage: 'Connection error, please try again'
            }
          };
        })
      }));
    }

    setTimeout(() => {
      return Math.round(Math.random()) > 0.25
        ? imitateConnected()
        : imitateConnectionError();
    }, 2500);
  };

  logoutWallet = (wallet: WalletModel) => {
    // TODO: Logout, then just remove
    return this.dismissWallet(wallet);
  };

  getDefaultWallet = () => {
    const { activeWallets } = this.state;
    if (!activeWallets || !activeWallets.length) return void 0;
    const connectedWallets = activeWallets.filter(
      w => w.connectionStatus.connected
    );
    if (!connectedWallets.length) return void 0;
    return connectedWallets[0];
  };

  getDefaultWalletInfo = () => {
    const defaultWallet = this.getDefaultWallet();
    if (!defaultWallet) return void 0;
    return defaultWallet.walletInfo;
  };

  getWalletInfo = (providerId: string) => {
    // TODO
  };

  getUserInfo = (sessionState: SessionState) => {
    // TODO
  };

  logout = async () => {
    this.setState({
      activeWallets: []
    });
  };
}

export default SessionStateContainer;
