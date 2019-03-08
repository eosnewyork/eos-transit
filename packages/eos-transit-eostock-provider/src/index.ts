import { Api, ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';
import EOS from 'eosjsv1';

import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';

export function __makeSignatureProvider(network: NetworkConfig) {
	// because you are signing on eostock, do not set keyProvider.
	const _network = {
		httpEndpoint: network.protocol + '://' + network.host + ':' + network.port,
		chainId: network.chainId
	};

	// @ts-ignore: We don't have Tyepscript typing for eosTock
	//const eos = window.eosTock.eos(_network, EOS);

	// return eos;

	// 3rd param: beta3 = true
	// return scatter.eosHook({ ...network, blockchain: 'eos' }, null, true);
}

function makeSignatureProvider(network: NetworkConfig) {
	return {
		async getAvailableKeys() {
			console.log('In getAvailableKeys');
			let arr: string[] = [ 'EOS5ryMP4HXW4tHLyjxPv6DrhT25RVjwsACHnwijHdpkXPEA3CsQF' ];
			return arr;
		},

		async sign(
			signatureProviderArgs: ApiInterfaces.SignatureProviderArgs
		): Promise<RpcInterfaces.PushTransactionArgs> {
			console.log('In Sign');

			// because you are signing on eostock, do not set keyProvider.
			const _network = {
				httpEndpoint: network.protocol + '://' + network.host + ':' + network.port,
				chainId: network.chainId
			};

			// @ts-ignore: We don't have Tyepscript typing for eosTock
			const eos = window.eosTock.eos(_network, EOS);
			// We need to find a way to have eosTock sign the txn, return the signature and the buffer
			// https://github.com/GetScatter/scatter-js/blob/master/packages/plugin-eosjs2/src/index.js#L28-L51

			// let transfer = await eos.transfer('inita', 'initb', '1.0000 SYS', '');
			// console.log('transfer');
			// console.log(transfer);
			// let transferTransaction = transfer.transaction;
			// console.log('transferTransaction');
			// console.log(transferTransaction);

			var signatureArray = [ '' ];
			var respone: RpcInterfaces.PushTransactionArgs = {
				signatures: signatureArray,
				serializedTransaction: signatureProviderArgs.serializedTransaction
			};

			return respone;
		}
	};
}

export function eosTockWalletProvider() {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		// Connection

		function connect(appName: string): Promise<any> {
			let res = async function m2(): Promise<any> {
				return true;
			};
			return res();
		}

		function discover(discoveryOptions: DiscoveryOptions) {
			return new Promise((resolve, reject) => {
				let discoveryInfo = {
					keys: [],
					note: 'eosTock does not support discovery'
				};

				resolve(discoveryInfo);
			});
		}

		function disconnect(): Promise<any> {
			return Promise.resolve(true);
		}

		// Authentication
		async function login(accountName?: string): Promise<WalletAuth> {
			const _networks = [
				{
					httpEndpoint: network.protocol + '://' + network.host + ':' + network.port,
					chainId: network.chainId
				}
			];

			// @ts-ignore: We don't have Tyepscript typing for eosTock
			let auth = await window.eosTock
				.login(_networks)
				.then((identify: any) => {
					return identify;
				})
				.catch((error: any) => {
					console.log(error);
				});

			console.log(auth);
			//TODO: Need a way to get the permission and publicKey for the selected account.
			return {
				accountName: auth.account,
				permission: 'active',
				publicKey: 'EOS5ryMP4HXW4tHLyjxPv6DrhT25RVjwsACHnwijHdpkXPEA3CsQF'
			};
		}

		function logout(accountName?: string): Promise<any> {
			let res = async function m2(): Promise<any> {
				if (true) return true;
			};
			return res();
		}

		const walletProvider: WalletProvider = {
			id: 'eosTock',
			meta: {
				name: 'eosTock',
				shortName: 'eosTock',
				description: 'oesTock browser extenison'
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

export default eosTockWalletProvider;
