import { Api, ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';
import * as EosLedger from './EosLedger';
import Transport from '@ledgerhq/hw-transport-u2f';
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
	async getPathKeys(keyPositions: number[]): Promise<matchedIndexItem[]> {
		let transport = await Transport.create();
		const eos = new EosLedger.default(transport);
		let keys: matchedIndexItem[] = [];

		for (let num of keyPositions) {
			let result = await eos.getAddress("44'/194'/0'/0/" + num);
			//keys[num] = result.address;
			keys.push({ index: num, key: result.address });
		}

		return keys;
	}

	async sign(toSign: Buffer, index: number): Promise<string> {
		let transport = await Transport.create();
		const eos = new EosLedger.default(transport);
		let signatures: string[] = [ '' ];

		let toSignHex = toSign.toString('hex');
		let signedTxn = await eos.signTransaction("44'/194'/0'/0/" + index, toSignHex);

		// console.log(signedTxn.r);
		// console.log(signedTxn.s);
		// console.log(signedTxn.v);
		var si = new ecc.Signature(bigi.fromHex(signedTxn.r), bigi.fromHex(signedTxn.s), bigi.fromHex(signedTxn.v));

		return si.toString();
	}
}

export interface ledgerWalletProviderOptions {
	id?: string;
	name?: string;
	shortName?: string;
	description?: string;
	errorTimeout?: number;
}

export function ledgerWalletProvider(
	{
		id = 'ledger',
		name = 'Ledger Nano S',
		shortName = 'Ledger Nano S',
		description = 'Use Ledger Nano S hardware wallet to sign your transactions',
		errorTimeout
	}: ledgerWalletProviderOptions = {}
) {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);
		// let keys: string[] = [];
		let selectedIndex: number = -1;
		let selectedIndexArray: { id: string; index: number }[] = [];
		let keyMap: matchedIndexItem[] = [];

		function connect(appName: string) {
			return new Promise((resolve, reject) => {
				resolve();
			});
		}

		function discover(discoveryOptions: DiscoveryOptions) {
			return new Promise((resolve, reject) => {
				var _pathIndexList = discoveryOptions.pathIndexList || [ 0, 1, 2, 3 ];
				var missingIndexs: number[] = [];

				// let alreadyDiscoveredIndexs = keyMap.map(a => a.index);
				_pathIndexList.forEach((index: number) => {
					let matchedIndex: matchedIndexItem | undefined = keyMap.find((i) => i.index === index);
					if (!matchedIndex) {
						missingIndexs.push(index);
					}
				});

				// console.log('missingIndexs:');
				// console.log(missingIndexs);

				let ledger = new LedgerProxy();
				ledger
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
					.catch((ex) => reject(ex));
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

			return new Promise<WalletAuth>((resolve, reject) => {
				let user: WalletAuth = {
					accountName: accountName,
					permission: authorization,
					publicKey: key
				};
				resolve(user);
			});
		}

		function logout(accountName?: string): Promise<boolean> {
			return Promise.resolve(true);
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

					let ledger = new LedgerProxy();

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
			logout
		};

		return walletProvider;
	};
}

export default ledgerWalletProvider;
