import { Api, ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';
import * as EosLedger from './EosLedger';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebAuthn from '@ledgerhq/hw-transport-webauthn';
import TransportWebBLE from '@ledgerhq/hw-transport-web-ble';
import TransportWebusb from '@ledgerhq/hw-transport-webusb';

import LedgerDataManager from './LedgerDataManager';
import 'babel-polyfill';
import * as ecc from 'eosjs-ecc';
import * as bigi from 'bigi';
// import {discoveryOptions} from './types';
// https://github.com/LedgerHQ/ledgerjs/issues/266
// https://github.com/JoinColony/purser/issues/184

class history_get_key_accounts_result {
	account_names: string[];
}

export interface matchedIndexItem {
	index: number;
	key: string;
}

class LedgerProxy {

	_exchangeTimeout: number;
	transport: any;
	public constructor(exchangeTimeout: number, supplied_transport: any){
		this._exchangeTimeout = exchangeTimeout;
		this.transport = supplied_transport;
	};

	async getPathKeys(keyPositions: number[]): Promise<matchedIndexItem[]> {
		
		// let transport: any = await this.initTransport();

		// let transport = await Transport.create();
		const eos = new EosLedger.default(this.transport);
		let keys: matchedIndexItem[] = [];

		for (let num of keyPositions) {
			console.log('getting address from ledger: ' + num);
			let result = await eos.getAddress("44'/194'/0'/0/" + num);
			//keys[num] = result.address;
			keys.push({ index: num, key: result.address });
		}

		return keys;
	}

	async sign(toSign: Buffer, index: number): Promise<string> {
		// let transport: any = await this.initTransport();

		// let transport = await Transport.create();
		const eos = new EosLedger.default(this.transport, this._exchangeTimeout);
		let signatures: string[] = [ '' ];

		let toSignHex = toSign.toString('hex');
		let signedTxn = await eos.signTransaction("44'/194'/0'/0/" + index, toSignHex);

		// console.log(signedTxn.r);
		// console.log(signedTxn.s);
		// console.log(signedTxn.v);
		var si = new ecc.Signature(bigi.fromHex(signedTxn.r), bigi.fromHex(signedTxn.s), bigi.fromHex(signedTxn.v));

		return si.toString();
	}

	// private async initTransport() {
	// 	let transport: any;
	// 	if (this._transport === 'TransportWebAuthn') {
	// 		transport = await TransportWebAuthn.create();
	// 	}
	// 	else {
	// 		transport = await TransportU2F.create();
	// 	}
	// 	transport.setExchangeTimeout(this._exchangeTimeout);
	// 	return transport;
	// }
}

export interface ledgerWalletProviderOptions {
	id?: string;
	name?: string;
	shortName?: string;
	description?: string;
	exchangeTimeout?: number;
	transport?: 'TransportWebAuthn' | 'TransportU2F' | 'TransportWebBLE' | 'TransportWebusb' ;
}

export function ledgerWalletProvider(
	{
		id = 'ledger',
		name = 'Ledger Nano S',
		shortName = 'Ledger Nano S',
		description = 'Use Ledger Nano S hardware wallet to sign your transactions',
		exchangeTimeout = 10000,
		transport = 'TransportU2F'
	}: ledgerWalletProviderOptions = {}
) {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);
		// let keys: string[] = [];
		let selectedIndex: number = -1;
		let selectedIndexArray: { id: string; index: number }[] = [];
		let keyMap: matchedIndexItem[] = [];
		let ledger: LedgerProxy;
		let selectedTransport: any;

		async function connect(appName: string) {
			if (transport === 'TransportWebAuthn') {
				selectedTransport = await TransportWebAuthn.create();
			} else if (transport === 'TransportWebBLE') {
				selectedTransport = await TransportWebBLE.create();
			} else if (transport === 'TransportWebusb') {
				selectedTransport = await TransportWebusb.create();
			}
			else {
				selectedTransport = await TransportU2F.create();
			}

			selectedTransport.setExchangeTimeout(exchangeTimeout);
			ledger = new LedgerProxy(exchangeTimeout, selectedTransport);

		}

		function discover(discoveryOptions: DiscoveryOptions) {
			return new Promise((resolve, reject) => {

				if (discoveryOptions.presetKeyMap) {
					keyMap = keyMap.concat(...discoveryOptions.presetKeyMap);
					let discoveryInfo = {
						keys: keyMap,
						note: 'Preset List'
					};
					resolve(discoveryInfo);
					return;
				}

				var _pathIndexList = discoveryOptions.pathIndexList || [ 0, 1, 2, 3 ];
				var missingIndexs: number[] = [];

				// let alreadyDiscoveredIndexs = keyMap.map(a => a.index);
				_pathIndexList.forEach((index: number) => {
					let matchedIndex: matchedIndexItem | undefined = keyMap.find((i) => i.index === index);
					if (!matchedIndex) {
						missingIndexs.push(index);
					}
				});

				return ledger
					.getPathKeys(missingIndexs)
					.then((keysResult: matchedIndexItem[]) => {
						//Merge the new key info with any previous lookups
						keyMap = keyMap.concat(...keysResult);

						let xxx = keyMap.map((a) => a.key);
						let discoveryInfo = {
							keys: keyMap,
							note: 'add any extra discoverable info here'
						};
						resolve(discoveryInfo);
					})
			});
		}

		function disconnect(): Promise<any> {
			return Promise.resolve();
		}

		// Authentication

		async function login(
			accountName?: string,
			authorization?: string,
			index?: number,
			key?: string
		): Promise<WalletAuth> {
			// Every time someone calls login we add to the list of account names + ledger index.
			// Then when it comes time to sign, we'll look for the accountName + auth match and use that Index to sign the txn.
			if (accountName && authorization && key && index != undefined) {
				selectedIndexArray.push({ id: accountName + '@' + authorization, index: index });
			} else {
				throw 'When calling the ledger login function: accountName, authorization, index and key must be supplied';
			}
			let user: WalletAuth = {
				accountName: accountName,
				permission: authorization,
				publicKey: key
			};
			return user;
		}

		function logout(accountName?: string): Promise<boolean> {
			return Promise.resolve(true);
		}

		function signArbitrary(data: string, userMessage: string): Promise<string> {
			return new Promise((resolve, reject) => {
				reject('not implemented');
			});
		}

		function makeSignatureProvider() {
			return {
				async getAvailableKeys() {
					// var filtered = keys.filter(function(el) {
					// 	return el != null;
					// });
					let arr = keyMap.map((a) => a.key);
					return arr;
				},

				async sign(
					signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
				): Promise<RpcInterfaces.PushTransactionArgs> {
					const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);
					var args = {
						rpc: rpc,
						authorityProvider: undefined,
						abiProvider: undefined,
						signatureProvider: this,
						chainId: undefined,
						textEncoder: undefined,
						textDecoder: undefined
					};
					const api = new Api(args);
					var _txn = await api.deserializeTransactionWithActions(signatureProviderArgs.serializedTransaction);

					// console.log(new Buffer(signatureProviderArgs.serializedTransaction).toString('hex'));
					// console.log(_txn);

					var ledgerManager = new LedgerDataManager();
					const ledgerBuffer = await ledgerManager.serialize(
						signatureProviderArgs.chainId,
						_txn,
						api.abiTypes,
						api
					);

					// console.log("ledgerBuffer");
					// console.log(ledgerBuffer);

					// let ledger = new LedgerProxy(exchangeTimeout, transport);

					// console.log(_txn);
					// console.log(selectedIndexArray);

					// We need to look into the transaction to see which accounts and permissions are trying to sign.
					// Then we try to find out which index that is on the ledger.
					// There is a small chance that there are multiple matches. This logic will match the last one. I can't think of a case where this would happen though.
					if (_txn.actions) {
						_txn.actions.forEach((action: any) => {
							action.authorization.forEach((authorization: any) => {
								let m = selectedIndexArray.find((x: any) => {
									var matchStr = authorization.actor + '@' + authorization.permission;
									return x.id === matchStr;
								});
								if (m) {
									selectedIndex = m.index;
									// console.log('match in loop: ' + m.index);
								}
							});
						});
					} else {
						throw 'The transaciton does not contain any actions. Possible bug in eos-transit-ledger-provider';
					}

					if (selectedIndex == -1) {
						throw 'eos-transit-ledger-provider was unable to determine which index to use for the signature. Check that login() was called with the account that is now required to sign the transaction';
					}

					console.log('selectedIndex: ' + selectedIndex);

					let signature = await ledger.sign(ledgerBuffer, selectedIndex);
					var signatureArray = [ signature ];
					var respone: RpcInterfaces.PushTransactionArgs = {
						signatures: signatureArray,
						serializedTransaction: signatureProviderArgs.serializedTransaction
					};

					console.log(respone);

					return respone;
				}
			};
		}

		const walletProvider: WalletProvider = {
			id,
			meta: {
				name,
				shortName,
				description
			},
			signatureProvider: makeSignatureProvider(),
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

export default ledgerWalletProvider;


// force rebuild 2