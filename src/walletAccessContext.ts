import { Api, JsonRpc } from 'eosjs';
import {
  WalletAccessContextOptions,
  WalletAccessContext,
  WalletProvider,
  WalletAccessSession,
  WalletAccessContextState,
  StateListener,
  StateUnsubscribeFn
} from './types';
import { makeStateContainer } from './stateContainer';
import { initAccessSession } from './walletAccessSession';
import { getNetworkUrl } from './util';

const DEFAULT_CONTEXT_STATE: WalletAccessContextState = {
  sessions: []
};

function findProviderById(
  walletProviders: WalletProvider[],
  providerId: string
) {
  if (!walletProviders.length) return void 0;
  return walletProviders.find(wp => wp.id === providerId);
}

export function initAccessContext(
  options: WalletAccessContextOptions
): WalletAccessContext {
  const { appName, network, walletProviders } = options;
  const _stateContainer = makeStateContainer(DEFAULT_CONTEXT_STATE);

  const eosRpcUrl = getNetworkUrl(network);
  const eosRpc = new JsonRpc(eosRpcUrl, { fetch });

  const ctx: WalletAccessContext = {
    appName,
    eosRpc,
    network,

    initSession(walletProvider: WalletProvider | string): WalletAccessSession {
      const _walletProvider =
        typeof walletProvider === 'string'
          ? findProviderById(walletProviders, walletProvider)
          : walletProvider;

      if (!_walletProvider) {
        throw new Error(`
          Cannot initiate a session, invalid wallet provider
          or wallet provider ID was passed
        `);
      }

      // TODO: Consider also having generated session IDs
      const newSession = initAccessSession(_walletProvider, ctx);

      _stateContainer.updateState(state => ({
        sessions: [...((state && state.sessions) || []), newSession]
      }));

      return newSession;
    },

    getWalletProviders(): WalletProvider[] {
      return walletProviders;
    },

    getSessions(): WalletAccessSession[] {
      const state = _stateContainer.getState();
      if (!state) return [];
      return state.sessions || [];
    },

    getActiveSessions(): WalletAccessSession[] {
      return ctx
        .getSessions()
        .filter(session => session.connected && session.authenticated);
    },

    detachSession(session: WalletAccessSession) {
      _stateContainer.updateState(state => ({
        sessions: ((state && state.sessions) || []).filter(s => s !== session)
      }));
    },

    logoutAll(): Promise<boolean> {
      return Promise.all(
        ctx.getSessions().map(session => session.logout())
      ).then(() => true);
    },

    disconnectAll(): Promise<boolean> {
      return Promise.all(
        ctx.getSessions().map(session => session.disconnect())
      ).then(() => true);
    },

    terminateAll(): Promise<boolean> {
      return Promise.all(
        ctx.getSessions().map(session => session.terminate())
      ).then(() => true);
    },

    subscribe(
      listener: StateListener<WalletAccessContextState>
    ): StateUnsubscribeFn {
      return _stateContainer.subscribe(listener);
    }
  };

  return ctx;
}
