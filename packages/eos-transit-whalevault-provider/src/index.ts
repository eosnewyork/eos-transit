import { Api, ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';

interface WhaleVaultState {
	accountPublickey: string,  // active pubkey
	accountPubKeys: {},
	accountChain: string,
	accountName: string,
	network?: NetworkConfig,
	appId: string,
	whalevault: any
}
const wv: WhaleVaultState = {
	accountPublickey: '',
	accountPubKeys: {},
	accountChain: '',
	accountName: '',
	appId: '',
	whalevault: null
}

declare global {
    interface Window { whalevault: any; }
}

window.whalevault = window.whalevault || null;

function logIfDebugEnabled(msg: string) {
	const debug = localStorage.getItem('DEBUG');
	if (debug === 'true') {
		console.log('IN WALLET: ' + msg);
	}
}

function makeSignatureProvider(network: NetworkConfig) {
	wv.network = network;
	return {
		async getAvailableKeys() {
			logIfDebugEnabled('In getAvailableKeys');

			logIfDebugEnabled('Return Active Key: ' + wv.accountPublickey);
			const arr: string[] = [ wv.accountPublickey ];
			return arr;
		},

		async sign(
			signatureProviderArgs: ApiInterfaces.SignatureProviderArgs,
			reason?: string
		): Promise<RpcInterfaces.PushTransactionArgs> {
			logIfDebugEnabled('In Sign');

			const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);
			const args = { rpc, 
                           authorityProvider: undefined, 
                           abiProvider: undefined, 
                           signatureProvider: this, 
                           chainId: undefined, 
                           textEncoder: undefined, 
                           textDecoder: undefined
                         };
			const api = new Api(args);
			const _txn = await api.deserializeTransactionWithActions(signatureProviderArgs.serializedTransaction);

			if (reason == null || reason === '') reason = _txn.actions[0].name;

			_txn.network = network;

			const response = await wv.whalevault.promiseRequestSignBuffer(wv.appId, wv.accountChain+':'+wv.accountName, 
                                                                          _txn, 'active', reason, 'eos');

			const signatureArray = response.success ? [response.result] : [];
			const sigResponse: RpcInterfaces.PushTransactionArgs = {
				signatures: signatureArray,
				serializedTransaction: signatureProviderArgs.serializedTransaction
			};

			return sigResponse;
		}
	};
}

function signArbitrary(data: string, userMessage: string): Promise<string> {
	return new Promise((resolve, reject) => {
		if (wv.appId === '') reject('uninitalized');
		wv.whalevault.requestSignBuffer(wv.appId, wv.accountChain+':'+wv.accountName, data, 'active',
                                        userMessage, 'eos', (response: any) => {
			if (response.success) resolve(response.result); else reject(response.message);
		});
	});
}

export function whalevaultWalletProvider() {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		// Connection

		function connect(appName: string): Promise<any> {
			logIfDebugEnabled('The connect method of transit:WhaleVault was called');
			console.log(window.whalevault);
			console.log(wv);
			logIfDebugEnabled('done');

			if (!appName || appName === '') throw new Error('appName required');

			const res = async function m2(): Promise<any> {
				console.log('her1');
				if (wv.whalevault) return true;
				console.log('her2');
				// await new Promise((resolve, reject) => { window.onload = resolve; });
				console.log('her3');
				if (typeof window.whalevault !== 'undefined') {
					const response = await window.whalevault.promiseRequestHandshake(appName);
					if (response) {
						wv.appId = appName;
						wv.whalevault = window.whalevault;
						return true; 
					} else return false;
				}
				return false;
			};
			return res();
		}

		function discover(discoveryOptions: DiscoveryOptions) {
			logIfDebugEnabled('The discover() method of transit:WhaleVault was called');

			return new Promise((resolve, reject) => {
				const discoveryInfo = {
					keys: [],
					note: 'WhaleVault does not support discovery'
				};

				resolve(discoveryInfo);
			});
		}

		function disconnect(): Promise<any> {
			wv.accountPublickey = '';
			wv.accountPubKeys = '';
			wv.accountChain = '';
			wv.accountName = '';
			wv.appId = '';
			return Promise.resolve(true);
		}

		// Authentication
		async function login(accountName?: string): Promise<WalletAuth> {
			logIfDebugEnabled('The login method of transit:WhaleVault was called');

			if (wv.appId === '') throw new Error('uninitalized');
			if (accountName == null) throw new Error('chainid:userid must be provided');
			
			const arrAccount = accountName.split(":");
			if (arrAccount.length > 1) {
				wv.accountChain = arrAccount[0];
				wv.accountName = arrAccount[1];
			} else {
				wv.accountChain = 'eos'
				wv.accountName = arrAccount[0];
			}

			if (wv.whalevault) {
				const pkResponse = await wv.whalevault.promiseRequestPubKeys(wv.appId, wv.accountChain+':'+wv.accountName);

				if (pkResponse.success && pkResponse.result &&
					pkResponse.result[wv.accountChain+':'+wv.accountName] &&
					pkResponse.result[wv.accountChain+':'+wv.accountName].activePubkey) {

					wv.accountPubKeys = pkResponse.result[wv.accountChain+':'+wv.accountName];
					wv.accountPublickey = pkResponse.result[wv.accountChain+':'+wv.accountName].activePubkey;

					return {
						accountName: wv.accountName,
						permission: 'active',
						publicKey: wv.accountPublickey
					};

				} else throw new Error("activeKey not found in WhaleVault for "+wv.accountChain+':'+wv.accountName);
			}
			
			throw new Error('WhaleVault not Found!');

		}

		function logout(accountName?: string): Promise<any> {
			wv.accountPublickey = '';
			wv.accountPubKeys = '';
			wv.accountChain = '';
			wv.accountName = '';
			wv.appId = '';
			const res = async function m2(): Promise<any> {
				if (true) return true;
			};
			return res();
		}

		const walletProvider: WalletProvider = {
			id: 'whalevault',
			meta: {
				name: 'WhaleVault',
				shortName: 'WhaleVault',
				description: 'WhaleVault :: Secure Graphene Cross-Chain Key Store Extension 🐳'
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

export default whalevaultWalletProvider;