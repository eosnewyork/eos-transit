import { UALInstance } from 'eos-ual';
import { Container } from 'unstated';
import {
  WalletModel,
  WalletProviderInfo,
  WalletInfo
} from '../shared/wallets/types';

// BEWARE! There be dragons!

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

// const tempActiveWallets = [
//   {
//     providerInfo: walletProviders[0],
//     connectionStatus: {
//       connected: true
//     },
//     walletInfo: {
//       ...tempWalletInfo
//     }
//   }
// ];

export const DEFAULT_SESSION_STATE = {
  // activeWallets: tempActiveWallets
  activeWallets: []
};

export class SessionStateContainer extends Container<SessionState> {
  constructor(private ual: UALInstance, private appName: string) {
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
    if (this.isProviderAdded(wallet.providerInfo.id)) {
      return Promise.resolve(wallet);
    }

    await this.setState(state => ({
      activeWallets: [...state.activeWallets, wallet]
    }));

    return this.connectToWallet(wallet);
  };

  dismissWallet = (wallet: WalletModel) => {
    this.setState(state => ({
      activeWallets: state.activeWallets.filter(
        w => w.providerInfo.id !== wallet.providerInfo.id
      )
    }));
  };

  connectToWallet = async (wallet: WalletModel) => {
    const _this = this;

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

    function onConnected(walletInfo: WalletInfo) {
      return _this.setState(state => ({
        activeWallets: state.activeWallets.map(w => {
          if (w.providerInfo.id !== wallet.providerInfo.id) return w;
          return {
            ...w,
            connectionStatus: {
              connected: true,
              connecting: false
            },
            walletInfo
          };
        })
      }));
    }

    function onConnectionError() {
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

    // TEMP: Using real connection for Scatter but
    // hardcoding the imitation for everything else

    if (wallet.providerInfo.id === 'scatter-desktop') {
      // NOTE: This is rather hackery now, the UAL is about
      // to be rebuilt completely. Sorry for this mess :)
      try {
        const connectionInfo = await this.ual.connect();
        const walletInfo = await this.getWalletInfo(
          wallet.providerInfo.id,
          connectionInfo.accountName
        );
        if (!walletInfo) {
          return Promise.reject('No wallet info has been obtained');
        }
        return onConnected(walletInfo);
      } catch (error) {
        await onConnectionError();
        return Promise.reject(
          'Connection error or no wallet info has been obtained'
        );
      }
    }

    return new Promise((resolve, reject) => {
      setTimeout(reject, 2500);
    }).catch(error => {
      onConnectionError();
    });

    // Just a temp hackery, might still be useful for demoing
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     return Math.round(Math.random()) > 0.25 ? resolve() : reject();
    //   }, 2500);
    // })
    //   .then(result => {
    //     return onConnected();
    //   })
    //   .catch(error => {
    //     return onConnectionError();
    //   });
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

  getWalletInfo = async (
    providerId: string,
    accountName: string
  ): Promise<WalletInfo | undefined> => {
    // TODO: providerId will be taken into account
    // here once UAL is capable of that
    const accountData = await this.ual.getAccount(accountName);
    if (!accountData) return Promise.reject('No account data has been fetched');

    return {
      accountName: accountData.account_name,
      accountAuthority: 'active',
      publicKey: accountData.publicKey,
      eosBalance: Number.parseFloat(accountData.core_liquid_balance || '0'),
      ram: accountData.ram_quota,
      cpu: Number.parseFloat(accountData.cpu_limit.available),
      net: Number.parseFloat(accountData.net_limit.available)
    };
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
