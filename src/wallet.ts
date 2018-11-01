import { Api } from 'eosjs';
import {
  WalletAccessContext,
  WalletProvider,
  Wallet,
  WalletState,
  AccountInfo,
  StateListener,
  StateUnsubscribeFn
} from './types';
import { makeStateContainer } from './stateContainer';
import { getErrorMessage } from './util';

const DEFAULT_STATE: WalletState = {
  connecting: false,
  connected: false,
  connectionError: false,
  connectionErrorMessage: void 0,
  authenticating: false,
  authenticated: false,
  authenticationConfirmed: false,
  authenticationError: false,
  authenticationErrorMessage: void 0,
  accountInfo: void 0,
  accountFetching: false,
  accountFetchError: false,
  accountFetchErrorMessage: void 0
};

export function initWallet(
  walletProvider: WalletProvider,
  ctx: WalletAccessContext
): Wallet {
  const _stateContainer = makeStateContainer(DEFAULT_STATE);
  const { getState } = _stateContainer;
  const eosApi = new Api({
    rpc: ctx.eosRpc,
    chainId: ctx.network.chainId,
    signatureProvider: walletProvider.signatureProvider,
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
  });

  // Account helpers

  function fetchAccountInfo(accountName?: string): Promise<AccountInfo> {
    _stateContainer.updateState(state => ({
      ...state,
      accountFetching: true,
      accountFetchError: false,
      accountFetchErrorMessage: void 0
    }));

    if (!accountName) {
      return Promise.reject(
        'No `accountName` was passed in order to fetch the account info'
      );
    }

    return ctx.eosRpc
      .get_account(accountName)
      .then((accountData: any) => {
        const accountInfo: AccountInfo = { ...accountData };
        _stateContainer.updateState(state => ({
          ...state,
          accountFetching: false,
          accountInfo
        }));

        return accountInfo;
      })
      .catch((error: any) => {
        _stateContainer.updateState(state => ({
          ...state,
          accountFetching: false,
          accountInfo: void 0,
          accountFetchError: true,
          accountFetchErrorMessage: getErrorMessage(error)
        }));

        return Promise.reject(error);
      });
  }

  // Connection

  function connect(): Promise<boolean> {
    _stateContainer.updateState({
      connected: false,
      connecting: true,
      connectionError: false,
      connectionErrorMessage: void 0
    });

    return walletProvider
      .connect(ctx.appName)
      .then(() => {
        _stateContainer.updateState({
          connecting: false,
          connected: true
        });

        return true;
      })
      .catch(error => {
        _stateContainer.updateState({
          connecting: false,
          connectionError: true,
          connectionErrorMessage: getErrorMessage(error)
        });

        return Promise.reject(error);
      });
  }

  function disconnect(): Promise<boolean> {
    return walletProvider.disconnect().then(() => {
      _stateContainer.updateState({
        connecting: false,
        connected: false,
        connectionError: false,
        connectionErrorMessage: void 0
      });

      return true;
    });
  }

  // Authentication

  function login(accountName?: string): Promise<AccountInfo> {
    _stateContainer.updateState(state => ({
      ...state,
      accountInfo: void 0,
      authenticated: false,
      authenticationConfirmed: false,
      authenticating: true,
      authenticationError: false,
      authenticationErrorMessage: void 0
    }));

    return walletProvider
      .login(accountName)
      .then(() => {
        _stateContainer.updateState(state => ({
          ...state,
          authenticated: true,
          authenticating: false
        }));

        return fetchAccountInfo(accountName);
      })
      .then((accountInfo: AccountInfo) => {
        _stateContainer.updateState(state => ({
          ...state,
          accountInfo
        }));

        return accountInfo;
      })
      .catch((error: any) => {
        _stateContainer.updateState(state => ({
          ...state,
          authenticating: false,
          authenticationError: true,
          authenticationErrorMessage: getErrorMessage(error)
        }));

        return Promise.reject(error);
      });
  }

  function logout(): Promise<boolean> {
    return walletProvider.disconnect().then(() => {
      _stateContainer.updateState(state => ({
        ...state,
        accountInfo: void 0,
        authenticating: false,
        authenticated: false,
        authenticationError: false,
        authenticationErrorMessage: void 0
      }));

      return true;
    });
  }

  const wallet: Wallet = {
    ctx,
    provider: walletProvider,
    eosApi,

    get state() {
      return getState() || { ...DEFAULT_STATE };
    },

    // Shortcut state accessors

    get accountInfo() {
      const state = getState();
      return (state && state.accountInfo) || void 0;
    },

    get connected(): boolean {
      const state = getState();
      return (state && state.connected) || false;
    },

    get authenticated(): boolean {
      const state = getState();
      return (state && state.authenticated) || false;
    },

    get inProgress(): boolean {
      const state = getState();
      if (!state) return false;
      const { connecting, authenticating, accountFetching } = state;
      return !!(connecting || authenticating || accountFetching);
    },

    get active(): boolean {
      const state = getState();
      if (!state) return false;
      const { connected, authenticated, accountInfo } = state;
      return !!(connected && authenticated && accountInfo);
    },

    get hasError(): boolean {
      const state = getState();
      if (!state) return false;
      const { connectionError, authenticationError, accountFetchError } = state;
      return !!(connectionError || authenticationError || accountFetchError);
    },

    get errorMessage(): string | undefined {
      const state = getState();
      if (!state) return void 0;
      if (!wallet.hasError) return void 0;
      const {
        connectionErrorMessage,
        authenticationErrorMessage,
        accountFetchErrorMessage
      } = state;
      return (
        connectionErrorMessage ||
        authenticationErrorMessage ||
        accountFetchErrorMessage ||
        'Wallet connection error'
      );
    },

    connect,
    disconnect,
    login,
    logout,
    fetchAccountInfo,

    terminate(): Promise<boolean> {
      return logout()
        .then(disconnect)
        .then(() => {
          ctx.detachWallet(wallet);
          return true;
        });
    },

    subscribe(listener: StateListener<WalletState>): StateUnsubscribeFn {
      return _stateContainer.subscribe(listener);
    }
  };

  return wallet;
}
