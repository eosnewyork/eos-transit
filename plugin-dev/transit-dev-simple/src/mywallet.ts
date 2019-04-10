import { Api, ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';

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

export function myWalletProvider() {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		// Connection

		function connect(appName: string): Promise<any> {
			logIfDebugEnabled('The connect method of myWallet was called');

			// Your logic here

			const res = async function m2(): Promise<any> {
				return true;
			};
			return res();
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

		function disconnect(): Promise<any> {
			return Promise.resolve(true);
		}

		// Authentication
		async function login(accountName?: string): Promise<WalletAuth> {
			logIfDebugEnabled('The login method of myWallet was called');

			// Your logic here ... then return an object similar to the one below. Hard coded here as an example
			accountPublickey = 'EOS5ryMP4HXW4tHLyjxPv6DrhT25RVjwsACHnwijHdpkXPEA3CsQF';

			return {
				accountName: 'eostransitio',
				permission: 'active',
				publicKey: accountPublickey
			};
		}

		function logout(accountName?: string): Promise<any> {
			const res = async function m2(): Promise<any> {
				if (true) return true;
			};
			return res();
		}

		const walletProvider: WalletProvider = {
			id: 'myWallet',
			meta: {
				name: 'myWallet',
				shortName: 'myWallet',
				description: 'myWallet description'
			},
			signatureProvider: makeSignatureProvider(network),
			connect,
			discover,
			disconnect,
			login,
			logout
		};

		return walletProvider;
	};
}

export default myWalletProvider;