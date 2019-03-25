import { Api, JsonRpc } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';


let accountPublickey: string;
let scatter: any;

if (typeof window !== undefined && typeof document !== undefined) {
	scatter = window['scatter'];

	document.addEventListener('scatterLoaded', function () {
		scatter = window['scatter'];
	})
}

function logIfDebugEnabled(msg: string) {
	const debug = localStorage.getItem('DEBUG');
	if (debug === 'true') {
		console.log('IN WALLET: ' + msg);
	}
}

function makeSignatureProvider(network: NetworkConfig) {
	const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);

	// @ts-ignore:
	const api = new Api({ rpc });

	let getAvailableKeys = async () => {
		logIfDebugEnabled('In getAvailableKeys');

		logIfDebugEnabled('Return Key: ' + accountPublickey);
		const arr: string[] = [accountPublickey];
		return arr;
	}

	if (scatter.hasOwnProperty('hookProvider')) {
		return Object.assign(scatter.hookProvider(network, {}, true, api), getAvailableKeys)
	}

	return { getAvailableKeys }
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
	return scatter.getArbitrarySignature(accountPublickey, data, userMessage);
}


export function tokenpocketWalletProvider() {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {

		// connection
		function connect(appName: string) {
			return new Promise((resolve, reject) => {

				let tries = 0;

				function checkConnect() {
					if (scatter) return resolve(true);

					tries++;

					if (tries > 5) return reject('Cannot connect to TokenPocket wallet provider')

					setTimeout(() => {
						checkConnect();
					}, 1000);
				}

				checkConnect();
			});
		}

		function disconnect(): Promise<any> {
			scatter.disconnect();
			return Promise.resolve(true);
		}

		// Authentication

		async function login(accountName?: string): Promise<WalletAuth> {

			try {
				const identity = await scatter.getIdentity({
					accounts: [{ ...network, blockchain: 'eos' }]
				});
				if (!identity) {
					return Promise.reject('No identity obtained from Scatter');
				}
				const account =
					(identity &&
						identity.accounts &&
						(identity.accounts as any[]).find((x) => x.blockchain === 'eos')) ||
					void 0;

				if (!account) {
					return Promise.reject('No account data obtained from Scatter identity');
				}

				accountPublickey = account.publicKey;

				return {
					accountName: account.name,
					permission: account.authority,
					publicKey: accountPublickey
				};
			} catch (error) {
				console.log('[Token Pocket]', error);
				return Promise.reject(error);
			}
		}

		function logout(accountName?: string): Promise<boolean> {
			return scatter.forgetIdentity();
		}

		const walletProvider: WalletProvider = {
			id: 'TokenPocket',
			meta: {
				name: 'TokenPocket',
				shortName: 'TP',
				description: 'TokenPocket is multi-chain mobile wallet that easy and safe to use.'
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

export default tokenpocketWalletProvider;
