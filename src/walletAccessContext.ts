import { Api, JsonRpc } from 'eosjs';
import {
  WalletAccessContext,
  WalletAccessContextState,
  WalletAccessContextOptions,
  WalletProvider,
  Wallet,
  WalletOptions,
  StateListener,
  StateUnsubscribeFn
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
  const { appName, network, walletProviders } = options;
  const _stateContainer = makeStateContainer(DEFAULT_CONTEXT_STATE);

  const eosRpcUrl = getNetworkUrl(network);
  const eosRpc = new JsonRpc(eosRpcUrl, { fetch });

  const ctx: WalletAccessContext = {
    appName,
    eosRpc,
    network,

    initWallet(
      walletProvider: WalletProvider | string,
      { attachToContext }: WalletOptions = {}
    ): Wallet {
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
      const newWallet = initWallet(_walletProvider, ctx);

      if (attachToContext !== false) {
        _stateContainer.updateState(state => ({
          wallets: [...((state && state.wallets) || []), newWallet]
        }));
      }

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

    subscribe(
      listener: StateListener<WalletAccessContextState>
    ): StateUnsubscribeFn {
      return _stateContainer.subscribe(listener);
    }
  };

  return ctx;
}
