import {
  WalletAccessContext,
  WalletAccessSession,
  WalletProvider,
  initAccessSession
} from 'wal-eos';
import { Container } from 'unstated';
import { WalletProviderInfo, WalletInfo } from '../shared/wallets/types';

// BEWARE! There be dragons!

export interface SessionState {
  walletSessions: WalletAccessSession[];
}

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

export const DEFAULT_SESSION_STATE = {
  walletSessions: []
};

export class SessionStateContainer extends Container<SessionState> {
  ctx: WalletAccessContext;

  constructor(ctx: WalletAccessContext) {
    super();
    this.state = DEFAULT_SESSION_STATE;
    this.ctx = ctx;

    // TODO: Implement some session persistence
    // this.state = this.sessionStateStorage.load() || DEFAULT_SESSION_STATE;
  }

  isLoggedIn = () => {
    return this.ctx.getActiveSessions().length;
  };

  getWalletProviders = () => {
    return this.ctx.getWalletProviders();
  };

  getAllWalletSessions = () => {
    const { ctx, getAvailableWalletProviders } = this;
    const { getSessions } = ctx;
    const untrackedSessions = getAvailableWalletProviders().map(p =>
      initAccessSession(p, ctx)
    );

    return [...getSessions(), ...untrackedSessions];
  };

  getAvailableWalletProviders = () => {
    const { getSessions, getWalletProviders } = this.ctx;
    const activeWalletProviderIds = getSessions().map(s => s.provider.id);

    return getWalletProviders().filter(
      walletProvider => !activeWalletProviderIds.includes(walletProvider.id)
    );
  };

  isProviderAdded = (providerId: string) => {
    return (
      providerId &&
      this.ctx.getSessions().some(s => s.provider.id === providerId)
    );
  };

  addWalletProvider = async (walletProvider: WalletProvider) => {
    const { getSessions, initSession } = this.ctx;
    if (this.isProviderAdded(walletProvider.id)) {
      return Promise.resolve(
        getSessions().find(s => s.provider.id === walletProvider.id)
      );
    }

    return initSession(walletProvider);
  };

  dismissWallet = (walletSession: WalletAccessSession) => {
    return walletSession.terminate();
  };

  logoutWalletSession = (walletSession: WalletAccessSession) => {
    // Could be just "logout", "disconnect", etc explicitly
    return walletSession.terminate();
  };

  getActiveSessions = () => this.ctx.getActiveSessions();

  getDefaultSession = () => {
    const { getActiveSessions } = this.ctx;
    const activeSessions = getActiveSessions();
    if (!activeSessions || !activeSessions.length) return void 0;
    return activeSessions[0];
  };

  getDefaultAccountInfo = () => {
    const defaultSession = this.getDefaultSession();
    if (!defaultSession) return void 0;
    return defaultSession.accountInfo;
  };

  getWalletInfo = async (
    providerId: string,
    accountName: string
  ): Promise<WalletInfo | undefined> => {
    // TODO: providerId will be taken into account
    // here once UAL is capable of that
    const walletAccessSession = this.ctx
      .getSessions()
      .find(session => session.provider.id === providerId);

    if (!walletAccessSession) {
      return Promise.reject(
        `No valid access session for given providerId: ${providerId}`
      );
    }

    const accountInfo = await walletAccessSession.fetchAccountInfo(accountName);
    if (!accountInfo) return Promise.reject('No account data has been fetched');

    return {
      accountName,
      accountAuthority: 'active',
      publicKey: accountInfo.publicKey,
      eosBalance: Number.parseFloat(accountInfo.core_liquid_balance || '0'),
      ram: accountInfo.ram_quota,
      cpu: accountInfo.cpu_limit.available,
      net: accountInfo.net_limit.available
    };
  };

  logout = async () => {
    this.ctx.terminateAll();
  };
}

export default SessionStateContainer;
