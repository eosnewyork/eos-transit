import { ApiInterfaces, RpcInterfaces } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';

// A fake wallet provider that does nothing and always
// errors on connection attempts. Useful for demoing.

let accountPublickey: string;

function logIfDebugEnabled(msg: string) {
	const debug = localStorage.getItem('DEBUG');
	if (debug === 'true') {
		console.log('IN WALLET: ' + msg);
	}
}

function makeSignatureProvider(network: NetworkConfig) {
	return {
		async getAvailableKeys() {
			logIfDebugEnabled('In getAvailableKeys');

			logIfDebugEnabled('Return Key: ' + accountPublickey);
			const arr: string[] = [ accountPublickey ];
			return arr;
		},

		async sign(
			signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
		): Promise<RpcInterfaces.PushTransactionArgs> {
			logIfDebugEnabled('In Sign');

			const signatureArray = [ '' ];
			const respone: RpcInterfaces.PushTransactionArgs = {
				signatures: signatureArray,
				serializedTransaction: signatureProviderArgs.serializedTransaction
			};

			return respone;
		}
	};
}

function discover(discoveryOptions: DiscoveryOptions) {
	logIfDebugEnabled('The discover() method of myWallet was called');

	// You probably do not need to implement this method.

	return new Promise((resolve, reject) => {
		const discoveryInfo = {
			keys: [],
			note: 'Wallet does not support discovery'
		};

		resolve(discoveryInfo);
	});
}

function signArbitrary(data: string, userMessage: string): Promise<string> {
	return new Promise((resolve, reject) => {
		reject('not implemented');
	});
}

export interface StubWalletProviderOptions {
	id: string;
	name: string;
	shortName: string;
	description?: string;
	errorTimeout?: number;
}

export function stubWalletProvider({ id, name, shortName, description, errorTimeout }: StubWalletProviderOptions) {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		function connect(appName: string) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					reject(`Cannot connect to "${shortName}" wallet provider`);
				}, errorTimeout || 2500);
			});
		}

		function disconnect(): Promise<any> {
			return Promise.resolve();
		}

		// Authentication

		async function login(accountName?: string): Promise<WalletAuth> {
			return new Promise<WalletAuth>((resolve, reject) => {
				setTimeout(() => {
					reject(`Cannot login to "${shortName}" wallet provider`);
				}, errorTimeout || 2500);
			});
		}

		function logout(accountName?: string): Promise<boolean> {
			return Promise.resolve(true);
		}

		const walletProvider: WalletProvider = {
			id,
			meta: {
				name,
				shortName,
				description
			},
			signatureProvider: makeSignatureProvider(network),
			connect,
			discover,
			disconnect,
			login,
			logout,
			signArbitrary
		};

		return walletProvider;
	};
}

export default stubWalletProvider;


// force rebuild 2