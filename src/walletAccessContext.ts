import { Api, JsonRpc } from 'eosjs';
import {
  WalletAccessContext,
  WalletAccessContextState,
  WalletAccessContextOptions,
  WalletProvider,
  Wallet,
  StateListener,
  StateUnsubscribeFn,
  UnsubscribeFn,
  Listener
} from './types';
import { makeStateContainer } from './stateContainer';
import { initWallet } from './wallet';
import { getNetworkUrl } from './util';

const DEFAULT_CONTEXT_STATE: WalletAccessContextState = {
  wallets: []
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
  const { appName, network } = options;
  const _makeWalletProviderFns = options.walletProviders;
  const walletProviders = _makeWalletProviderFns.map(makeWalletProvider =>
    makeWalletProvider(network)
  );

  const _stateContainer = makeStateContainer(DEFAULT_CONTEXT_STATE);
  let _listeners: Array<Listener<WalletAccessContext>> = [];

  function _handleUpdate() {
    for (const listener of _listeners) {
      listener(ctx);
    }
  }

  const _walletUnsubscribeFns: Map<string, UnsubscribeFn> = new Map();
  const stateUnsubscribe = _stateContainer.subscribe(_handleUpdate);

  const eosRpcUrl = getNetworkUrl(network);
  const eosRpc = new JsonRpc(eosRpcUrl, { fetch });

  const ctx: WalletAccessContext = {
    appName,
    eosRpc,
    network,

    initWallet(walletProvider: WalletProvider | string): Wallet {
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

      const newWallet = initWallet(_walletProvider, ctx);

      _stateContainer.updateState(state => ({
        wallets: [...((state && state.wallets) || []), newWallet]
      }));

      // Subscribe to a new wallet updates immediately
      _walletUnsubscribeFns.set(
        newWallet._instanceId,
        newWallet.subscribe(_handleUpdate)
      );

      return newWallet;
    },

    getWalletProviders(): WalletProvider[] {
      return walletProviders;
    },

    getWallets(): Wallet[] {
      const state = _stateContainer.getState();
      if (!state) return [];
      return state.wallets || [];
    },

    getActiveWallets(): Wallet[] {
      return ctx
        .getWallets()
        .filter(wallet => wallet.connected && wallet.authenticated);
    },

    detachWallet(wallet: Wallet) {
      _stateContainer.updateState(state => ({
        wallets: ((state && state.wallets) || []).filter(w => w !== wallet)
      }));

      const { _instanceId } = wallet;

      if (_walletUnsubscribeFns.has(_instanceId)) {
        const unsubscribe = _walletUnsubscribeFns.get(_instanceId);
        if (typeof unsubscribe === 'function') unsubscribe();
      }
    },

    logoutAll(): Promise<boolean> {
      return Promise.all(ctx.getWallets().map(wallet => wallet.logout())).then(
        () => true
      );
    },

    disconnectAll(): Promise<boolean> {
      return Promise.all(
        ctx.getWallets().map(wallet => wallet.disconnect())
      ).then(() => true);
    },

    terminateAll(): Promise<boolean> {
      return Promise.all(
        ctx.getWallets().map(wallet => wallet.terminate())
      ).then(() => true);
    },

    destroy(): Promise<any> {
      return ctx.terminateAll().then(() => {
        stateUnsubscribe();
        _walletUnsubscribeFns.forEach(unsubscribeFn => {
          if (typeof unsubscribeFn === 'function') unsubscribeFn();
        });
        _listeners = [];
      });
    },

    subscribe(
      listener: StateListener<WalletAccessContext>
    ): StateUnsubscribeFn {
      _listeners = [..._listeners, listener];

      return function unsubscribe() {
        _listeners = _listeners.filter(l => l !== listener);
      };
    }
  };

  return ctx;
}
