import { Api, JsonRpc, ApiInterfaces, RpcInterfaces } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';

let accountPublickey: string;
let scatter: any;
let signatureProvider: ApiInterfaces.SignatureProvider;

if (typeof window !== undefined && typeof document !== undefined) {
	// @ts-ignore:
	scatter = window.scatter;
	document.addEventListener('scatterLoaded', () => {
		// @ts-ignore:
		scatter = window.scatter;
	});
}

function discover(discoveryOptions: DiscoveryOptions) {
	// You probably do not need to implement this method.
	return new Promise((resolve, reject) => {
		const discoveryInfo = {
			keys: [],
			note: 'MEET.ONE does not support discovery'
		};

		resolve(discoveryInfo);
	});
}

function signArbitrary(data: string, userMessage: string): Promise<string> {
	return scatter.getArbitrarySignature(accountPublickey, data, userMessage);
}

export function meetoneWalletProvider() {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		// connection
		function connect(appName: string) {
			return new Promise((resolve, reject) => {
				if (scatter.wallet === 'MEETONE') {
					return resolve(true)
				}
				return Promise.reject('Cannot connect to Scatter');
			});
		}

		function disconnect(): Promise<any> {
			scatter.disconnect();
			return Promise.resolve(true);
		}

		// Authentication
		async function login(accountName?: string): Promise<WalletAuth> {
			try {
				const identity = await scatter.getIdentity({ accounts: [ { ...network, blockchain: 'eos' } ] });
				if (!identity) {
					return Promise.reject('No identity obtained from Scatter');
				}
				const account = (identity && identity.accounts && (identity.accounts as any[]).find((x) => x.blockchain === 'eos')) || void 0;

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
				return Promise.reject(error);
			}
		}

		function logout(accountName?: string): Promise<boolean> {
			return scatter.forgetIdentity();
		}

		const walletProvider: WalletProvider = {
			id: 'meetone_provider',
			meta: {
				name: 'MEET.ONE Wallet',
				shortName: 'M1',
				description: 'MEET.ONE - The Portal to EOS Ecology.'
			},
			signatureProvider: {
				async getAvailableKeys() {
					const arr: string[] = [ accountPublickey ];
					return arr;
				},
				async sign(
					signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
				): Promise<RpcInterfaces.PushTransactionArgs> {
					if (!signatureProvider) {
						// meetone client will overwrite the scatter.hookProvider property
						if (scatter.hookProvider) {
							const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);
							// @ts-ignore:
							const api = new Api({ rpc });
							signatureProvider = await scatter.hookProvider(network, {}, true, api);
						}
					}
					return signatureProvider.sign(signatureProviderArgs);
				}
			},
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

export default meetoneWalletProvider;
