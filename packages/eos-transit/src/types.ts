import { ApiInterfaces, JsonRpc, Api } from 'eosjs';
import { type } from 'os';

// Core helper types

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

export interface DiscoveryData {
	keyToAccountMap: DiscoveryAccount[];
	keys?: { index: number; key: string }[];
}

export interface DiscoveryAccount {
	index: number;
	key: string;
	accounts: {
		account: string;
		authorization: string;
	}[];
}

export interface WalletAuth {
	accountName: string;
	permission: string;
	publicKey: string;
}

// State management

export type StateUpdaterFn<TState> = (prevState: TState) => TState;

export type StateUpdater<TState> = StateUpdaterFn<TState> | TState;

export type UpdateStateFn<TState> = (updater: StateUpdater<TState>) => void;

export type StateListener<TState> = (newState: TState | undefined) => void;

export type StateUnsubscribeFn = () => void;

export interface StateContainer<TState = any> {
	getState: () => TState | undefined;
	updateState: UpdateStateFn<TState>;
	subscribe: (listener: StateListener<TState>) => StateUnsubscribeFn;
}

// Util

export type Listener<T = any> = (value?: T) => void;

export type UnsubscribeFn = () => void;

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
	discover(discoveryOptions: DiscoveryOptions): Promise<any>;
	disconnect(): Promise<any>;
	login(accountName?: string, authorization?: string, index?: number, key?: string): Promise<WalletAuth>;
	logout(accountName?: string): Promise<any>;
	signArbitrary(data: string, userMessage: string): Promise<string>;
}

export type MakeWalletProviderFn = (network: NetworkConfig) => WalletProvider;

// State-tracket Wallet instance

export interface WalletState {
	connecting?: boolean;
	connected?: boolean;
	connectionError?: boolean;
	connectionErrorMessage?: string;
	auth?: WalletAuth;
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

export type KeyModifierCallback = ( discoveryData: DiscoveryData ) => DiscoveryData;

//{ pathIndexList: [ 0, 1, 2, 35 ] }
export interface DiscoveryOptions {
	pathIndexList: number[];
	keyModifierFunc?: KeyModifierCallback;
	presetKeyMap?: any; // TODO: This data structure is not defined as a type right now, but should be. It's the same as the response structure from discover()
}

export interface Wallet {
	_instanceId: string; // UUID, for internal purposes
	ctx: WalletAccessContext;
	state: WalletState;
	provider: WalletProvider;
	eosApi: Api;
	auth?: WalletAuth;
	accountInfo?: AccountInfo;
	connected: boolean;
	authenticated: boolean;
	inProgress: boolean;
	active: boolean;
	hasError: boolean;
	errorMessage?: string;
	connect(): Promise<any>;
	discover(discoveryOptions: DiscoveryOptions): Promise<any>;
	disconnect(): Promise<any>;
	login(accountName?: string, authorization?: string): Promise<AccountInfo>;
	logout(accountName?: string): Promise<any>;
	fetchAccountInfo(accountName?: string): Promise<AccountInfo>;
	terminate(): Promise<boolean>;
	subscribe(listener: StateListener<WalletState>): StateUnsubscribeFn;
	signArbitrary(data: string, userMessage: string): Promise<string>;
}

// Wallet access context

export interface WalletAccessContextOptions {
	appName: string;
	network: NetworkConfig;
	walletProviders: MakeWalletProviderFn[];
}

export interface WalletAccessContextState {
	wallets: Wallet[];
}

export interface WalletAccessContext {
	appName: string;
	eosRpc: JsonRpc;
	network: NetworkConfig;
	initWallet(walletProvider: WalletProvider | string): Wallet;
	addWalletProvider(walletProvider: MakeWalletProviderFn): void;
	getWalletProviders(): WalletProvider[];
	getWallets(): Wallet[];
	getActiveWallets(): Wallet[];
	// updateWalletState(wallet: Wallet): void;
	detachWallet(wallet: Wallet): void;
	logoutAll(): Promise<boolean>;
	disconnectAll(): Promise<boolean>;
	terminateAll(): Promise<boolean>;
	destroy(): Promise<any>;
	subscribe(listener: Listener<WalletAccessContext>): UnsubscribeFn;
}

// Transactions

export type TransactionResult = any;
