import { Api, ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';

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

export interface matchedIndexItem {
	accountName: string;
	key: string;
}


export function whalevaultWalletProvider() {


	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		let keyMap: matchedIndexItem[] = [];

		let whalevault: any;
		let appId: string;
		let connected: boolean;
		

		function connect(appName: string): Promise<any> {
			logIfDebugEnabled('The connect method of transit:WhaleVault was called');
			
			if (!appName || appName === '') throw new Error('appName required');

			const res = async function m2(): Promise<any> {
				console.log(connected);
				if (connected) return true;
				console.log("window.whalevault");
				console.log(window.whalevault);
				if (window.whalevault !== null) {
					console.log("window.whalevault  xxx");
					const response = await window.whalevault.promiseRequestHandshake(appName);
					if (response) {
						connected = true;
						appId = appName;
						whalevault = window.whalevault;
						return true; 
					} else Promise.reject("Could not connect to WhaleVault");
				}
				return Promise.reject("Could not connect to WhaleVault");
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
			keyMap = [];
			return Promise.resolve(true);
		}

		// Authentication
		async function login(accountName?: string): Promise<WalletAuth> {
			logIfDebugEnabled('The login method of transit:WhaleVault was called');

			let wvAccountName = '';
			let wvAccountKey = '';

			//@ts-ignore
			let response = await whalevault.promiseRequestPubKeys(appId, "eos:");

			const arrAccount = response.data.username.split(":");
			if (arrAccount.length > 1) {
				wvAccountName = arrAccount[1];
			} else {
				Promise.reject("There was a problem with account selection. Transit was unable to detect which account was selected from within WhaleVault");
			}

			wvAccountKey = response.result[response.data.username].activePubkey;
			keyMap.push({ accountName: wvAccountName, key: wvAccountKey })

			return {
				accountName: wvAccountName,
				permission: 'active',
				publicKey: wvAccountKey
			};

		}

		function logout(accountName?: string): Promise<any> {
			keyMap = [];

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
			signatureProvider: {
				
					async getAvailableKeys() {
						logIfDebugEnabled('In getAvailableKeys');
			
						let arr = keyMap.map((a) => a.key);
						logIfDebugEnabled(JSON.stringify(arr));
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

						console.log(_txn);
						console.log('v2');
			
						if (reason == null || reason === '') reason = _txn.actions[0].name;
			
						_txn.network = network;
			
									 
						const response = await whalevault.promiseRequestSignBuffer(appId, 'eos:'+_txn.actions["0"].authorization["0"].actor, 
																					  _txn, _txn.actions["0"].authorization["0"].permission, reason, 'eos');
			
						const signatureArray = response.success ? [response.result] : [];
						const sigResponse: RpcInterfaces.PushTransactionArgs = {
							signatures: signatureArray,
							serializedTransaction: signatureProviderArgs.serializedTransaction
						};
			
						return sigResponse;
					}
				
			},
			connect,
			discover,
			disconnect,
			login,
			logout,
			signArbitrary: function signArbitrary(data: string, userMessage: string): Promise<string> {
				return new Promise((resolve, reject) => {
					if (appId === '') reject('uninitalized');
					// This is a bit of a hack. We don't know which account is requesting the arb signature so 1st account selected. Need to update transit framework to support. 
					whalevault.requestSignBuffer(appId, 'eos:'+keyMap[0].accountName, data, 'active',
													userMessage, 'eos', (response: any) => {
						if (response.success) resolve(response.result); else reject(response.message);
					});
				});
			}

		};

		return walletProvider;
	};
}

export default whalevaultWalletProvider;