import { Api, JsonRpc, ApiInterfaces, RpcInterfaces } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';
import { Metro, retries_response,get_pubkey_response, authenticate_response, MetroSettings }  from 'eos-metro-api';
import * as U2FTransport from 'eos-metro-transport-u2f';

export interface matchedIndexItem {
	index: number;
	key: string;
}

let metro : Metro;

let keyMap: matchedIndexItem[] = [];

function logIfDebugEnabled(msg: string) {
	// const debug = localStorage.getItem('DEBUG');
	const debug = 'true';
	if (debug === 'true') {
		console.log('IN WALLET: ' + msg);
	}
}

function discover(discoveryOptions: DiscoveryOptions) {
	logIfDebugEnabled('The discover() method of myWallet was called');

	// You probably do not need to implement this method.

	return new Promise((resolve, reject) => {

		metro.get_pubkey().then((getPubKeyResponse: get_pubkey_response) => {
			console.log(getPubKeyResponse);
			keyMap = [{index: 0, key: getPubKeyResponse.publicKey}];
			const discoveryInfo = {
				keys: keyMap,
				note: ''
			};
			resolve(discoveryInfo);
		}).catch((error: any) => {
			reject(error);
		}) 
		
	});
}

function signArbitrary(data: string, userMessage: string): Promise<string> {
	throw new Error("Not implemented");
}

export function metroWalletProvider() {
	// const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);
	let selectedIndex: number = -1;
	let selectedIndexArray: { id: string; index: number }[] = [];
	
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		// connection
		function connect(appName: string) {
			// TODO: We're going to need to adjust the framework to allow an optional paramert pin or settings object. 
			let pin = "sogyhdxoh3qwli😀";



			const transport = new U2FTransport.U2FTransport();
			metro = new Metro([transport]);
			
			logIfDebugEnabled('In wallet connect');
			return new Promise((resolve, reject) => {
				// TODO: Implement connect
				metro.get_retries().then((retriesResp: retries_response) => {
					if(retriesResp.remainingTries > 0 ) {
						metro.authenticate(pin).then((authResponse: authenticate_response)=> {
							if(authResponse.authenticated) {
								resolve(true);		
							} else {
								resolve(false);		
							}
								
						})
					} else {
						// The user us locked out of the device.
						resolve(false);
					}
				});
			});
		}

		function disconnect(): Promise<any> {
			// TODO: Impplement disconnect
			return Promise.resolve(true);
		}

		async function login(
			accountName?: string,
			authorization?: string,
			index?: number,
			key?: string
		): Promise<WalletAuth> {
			// Every time someone calls login we add to the list of account names + ledger index.
			// Then when it comes time to sign, we'll look for the accountName + auth match and use that Index to sign the txn.
			if (accountName && authorization && key && index !== undefined) {
				selectedIndexArray.push({ id: accountName + '@' + authorization, index });
			} else {
				throw new Error('When calling the ledger login function: accountName, authorization, index and key must be supplied');
			}

			return new Promise<WalletAuth>((resolve, reject) => {
				const user: WalletAuth = {
					accountName,
					permission: authorization,
					publicKey: key
				};
				resolve(user);
			});
		}

		function logout(accountName?: string): Promise<boolean> {
			return new Promise((resolve, reject) => {
				// TODO: Impplement logout
				resolve(true);
			});
		}

		const walletProvider: WalletProvider = {
			id: 'Metro',
			meta: {
				name: 'Metro',
				shortName: 'Metro',
				description: 'The easiest to use hardware key.'
			},
			signatureProvider: {
				async getAvailableKeys() {
					logIfDebugEnabled('In getAvailableKeys');
					logIfDebugEnabled(JSON.stringify(keyMap));
					let arr = keyMap.map((a) => a.key);
					logIfDebugEnabled(JSON.stringify(arr));
					return arr;
				},

				async sign(
					signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
				): Promise<RpcInterfaces.PushTransactionArgs> {
					logIfDebugEnabled('In Sign method');

					const signBuf = Buffer.concat([
						new Buffer(signatureProviderArgs.chainId, 'hex'), new Buffer(signatureProviderArgs.serializedTransaction), new Buffer(new Uint8Array(32)),
					]);

					console.log(signBuf);

					const settings: MetroSettings = {
						apiTimeout: 15,
						u2fTimeout: 15
					  };

					const signResponse = await metro.sign(signBuf, settings);


					var respone: RpcInterfaces.PushTransactionArgs = {
						signatures: [signResponse.signature],
						serializedTransaction: signatureProviderArgs.serializedTransaction
					};

					return respone;
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

export default metroWalletProvider;

// force rebuild