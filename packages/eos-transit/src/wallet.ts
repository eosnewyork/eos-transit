import { Api, JsonRpc } from 'eosjs';
import uuid from 'uuid/v4';
import {
	WalletAccessContext,
	WalletProvider,
	Wallet,
	WalletState,
	AccountInfo,
	StateListener,
	StateUnsubscribeFn,
	DiscoveryAccount,
	DiscoveryData
} from './types';
import { makeStateContainer } from './stateContainer';
import { getErrorMessage } from './util';
import { strict } from 'assert';
import { stringToSymbol } from 'eosjs/dist/eosjs-serialize';

const DEFAULT_STATE: WalletState = {
	connecting: false,
	connected: false,
	connectionError: false,
	connectionErrorMessage: void 0,
	auth: void 0,
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

export function initWallet(walletProvider: WalletProvider, ctx: WalletAccessContext): Wallet {
	const _instanceId = uuid();
	const _stateContainer = makeStateContainer({
		...DEFAULT_STATE
	});

	const { getState } = _stateContainer;
	const eosApi = new Api({
		rpc: ctx.eosRpc,
		chainId: ctx.network.chainId,
		signatureProvider: walletProvider.signatureProvider
	});

	// Account helpers

	function fetchAccountInfo(accountName?: string): Promise<AccountInfo> {
		if (!accountName) {
			return Promise.reject('No `accountName` was passed in order to fetch the account info');
		}

		_stateContainer.updateState((state) => ({
			...state,
			accountFetching: true,
			accountFetchError: false,
			accountFetchErrorMessage: void 0
		}));

		return ctx.eosRpc
			.get_account(accountName)
			.then((accountData: any) => {
				const accountInfo: AccountInfo = { ...accountData };
				_stateContainer.updateState((state) => ({
					...state,
					accountFetching: false,
					accountInfo
				}));

				return accountInfo;
			})
			.catch((error: any) => {
				_stateContainer.updateState((state) => ({
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
		_stateContainer.updateState((state) => ({
			...state,
			connected: false,
			connecting: true,
			connectionError: false,
			connectionErrorMessage: void 0
		}));

		return walletProvider
			.connect(ctx.appName)
			.then(() => {
				_stateContainer.updateState((state) => ({
					...state,
					connecting: false,
					connected: true
				}));

				return true;
			})
			.catch((error) => {
				_stateContainer.updateState((state) => ({
					...state,
					connecting: false,
					connectionError: true,
					connectionErrorMessage: getErrorMessage(error)
				}));

				return Promise.reject(error);
			});
	}

	async function discover(): Promise<any> {
		let accountsDataObjToMerge: DiscoveryData = { keyToAccountMap: [] };

		let discoverResult = await walletProvider.discover().then(async (walletDiscoveryData) => {
			//Merge any properties that were returned from the wallets specific discovery process. This allows the wallet to add custom properties to the response if needed.
			accountsDataObjToMerge = { ...accountsDataObjToMerge, ...walletDiscoveryData };

			let keys: string[] = []; // If the discover fuction in the wallet doesn't return any keys we know the login function is going to have to prompt the user to select one.
			if (walletDiscoveryData.keys) {
				keys = walletDiscoveryData.keys;
			}

			let promises = [];

			for (let key of keys) {
				if (key) {
					let p = ctx.eosRpc.history_get_key_accounts(key).then(async (accountData) => {
						let keyIndex = keys.findIndex((y: string) => y == key);

						let accountEntry: DiscoveryAccount = {
							index: keyIndex,
							key: key,
							accounts: []
						};

						if (accountData.account_names.length > 0) {
							for (let account of accountData.account_names) {
								await ctx.eosRpc.get_account(account).then(async (accountInfo) => {
									for (let permission of accountInfo.permissions) {
										for (let permissionKey of permission.required_auth.keys) {
											if (permissionKey.key == key) {
												accountEntry.accounts.push({
													account: account,
													authorization: permission.perm_name
												});
											}
										}
									}
								});
							}
						}

						return accountEntry;
					});
					promises.push(p);
				}
			}

			await Promise.all(promises).then((results) => {
				accountsDataObjToMerge.keyToAccountMap = results;
				return Promise.resolve({ accountsDataObjToMerge });
			});
		});

		return Promise.resolve(accountsDataObjToMerge);
	}

	function disconnect(): Promise<boolean> {
		return walletProvider.disconnect().then(() => {
			_stateContainer.updateState((state) => ({
				...state,
				connecting: false,
				connected: false,
				connectionError: false,
				connectionErrorMessage: void 0
			}));

			return true;
		});
	}

	// Authentication

	function login(accountName?: string, authorization?: string, index?: number, key?: string): Promise<AccountInfo> {
		_stateContainer.updateState((state) => ({
			...state,
			accountInfo: void 0,
			authenticated: false,
			authenticationConfirmed: false,
			authenticating: true,
			authenticationError: false,
			authenticationErrorMessage: void 0
		}));

		return walletProvider
			.login(accountName, authorization, index, key)
			.then((walletAuth) => {
				_stateContainer.updateState((state) => ({
					...state,
					auth: walletAuth,
					authenticated: true,
					authenticating: false
				}));

				return fetchAccountInfo(walletAuth.accountName);
			})
			.then((accountInfo: AccountInfo) => {
				_stateContainer.updateState((state) => ({
					...state,
					accountInfo
				}));

				return accountInfo;
			})
			.catch((error: any) => {
				_stateContainer.updateState((state) => ({
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
			_stateContainer.updateState((state) => ({
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
		_instanceId,
		ctx,
		provider: walletProvider,
		eosApi,

		get state() {
			return getState() || { ...DEFAULT_STATE };
		},

		// Shortcut state accessors

		get auth() {
			const state = getState();
			return (state && state.auth) || void 0;
		},

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
			const { connectionErrorMessage, authenticationErrorMessage, accountFetchErrorMessage } = state;
			return (
				connectionErrorMessage ||
				authenticationErrorMessage ||
				accountFetchErrorMessage ||
				'Wallet connection error'
			);
		},

		connect,
		discover,
		disconnect,
		login,
		logout,
		fetchAccountInfo,

		terminate(): Promise<boolean> {
			return logout().then(disconnect).then(() => {
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
