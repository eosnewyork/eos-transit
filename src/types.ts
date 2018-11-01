import { ApiInterfaces, JsonRpc, Api } from 'eosjs';

// Core types

export interface AccountInfo {
  name: string;
  publicKey: string;
  core_liquid_balance?: string;
  ram_quota?: number;
  cpu_limit: {
    available: number;
  };
  net_limit: {
    available: number;
  };

  // TODO: permissions and more
}

// State management

export type StateUpdaterFn<TState> = (
  prevState: TState | undefined
) => TState | undefined;

export type StateUpdater<TState> = StateUpdaterFn<TState> | TState | undefined;

export type UpdateStateFn<TState> = (updater: StateUpdater<TState>) => void;

export type StateListener<TState> = (newState: TState | undefined) => void;

export type StateUnsubscribeFn = () => void;

export interface StateContainer<TState = any> {
  getState: () => TState | undefined;
  updateState: UpdateStateFn<TState>;
  subscribe: (listener: StateListener<TState>) => StateUnsubscribeFn;
}

// Network

export interface NetworkConfig {
  name?: string;
  protocol?: string;
  host: string;
  port?: number;
  chainId: string;
}

// Wallet Providers

export interface WalletProviderMetadata {
  name?: string;
  shortName?: string;
  description?: string;
}

export interface WalletProvider {
  id: string;
  meta?: WalletProviderMetadata;
  signatureProvider: ApiInterfaces.SignatureProvider;
  connect(appName: string): Promise<any>;
  disconnect(): Promise<any>;
  login(accountName?: string): Promise<any>;
  logout(accountName?: string): Promise<any>;
}

// State-tracket Wallet instance

export interface WalletState {
  connecting?: boolean;
  connected?: boolean;
  connectionError?: boolean;
  connectionErrorMessage?: string;
  authenticating?: boolean;
  authenticated?: boolean;
  authenticationConfirmed?: boolean;
  authenticationError?: boolean;
  authenticationErrorMessage?: string;
  accountInfo?: AccountInfo;
  accountFetching?: boolean;
  accountFetchError?: boolean;
  accountFetchErrorMessage?: string;
}

export interface WalletOptions {
  attachToContext?: boolean;
}

export interface Wallet {
  ctx: WalletAccessContext;
  state: WalletState;
  provider: WalletProvider;
  eosApi: Api;
  accountInfo?: AccountInfo;
  connected: boolean;
  authenticated: boolean;
  inProgress: boolean;
  active: boolean;
  hasError: boolean;
  errorMessage?: string;
  connect(): Promise<any>;
  disconnect(): Promise<any>;
  login(accountName?: string): Promise<AccountInfo>;
  logout(accountName?: string): Promise<any>;
  fetchAccountInfo(accountName: string): Promise<AccountInfo>;
  terminate(): Promise<boolean>;
  subscribe(listener: StateListener<WalletState>): StateUnsubscribeFn;
}

// Wallet access context

export interface WalletAccessContextOptions {
  appName: string;
  network: NetworkConfig;
  walletProviders: WalletProvider[];
}

export interface WalletAccessContextState {
  wallets: Wallet[];
}

export interface WalletAccessContext {
  appName: string;
  eosRpc: JsonRpc;
  network: NetworkConfig;
  initWallet(
    walletProvider: WalletProvider | string,
    options?: WalletOptions
  ): Wallet;
  getWalletProviders(): WalletProvider[];
  getWallets(): Wallet[];
  getActiveWallets(): Wallet[];
  detachWallet(wallet: Wallet): void;
  logoutAll(): Promise<boolean>;
  disconnectAll(): Promise<boolean>;
  terminateAll(): Promise<boolean>;
  subscribe(
    listener: StateListener<WalletAccessContextState>
  ): StateUnsubscribeFn;
}

// Transactions

export type TransactionResult = any;
