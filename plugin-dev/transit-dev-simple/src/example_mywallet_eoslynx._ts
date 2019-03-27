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

			const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);
			const args = {
				rpc,
				authorityProvider: undefined,
				abiProvider: undefined,
				signatureProvider: this,
				chainId: undefined,
				textEncoder: undefined,
				textDecoder: undefined
			};
			const api = new Api(args);
			const _txn = await api.deserializeTransactionWithActions(signatureProviderArgs.serializedTransaction);

			// logIfDebugEnabled(JSON.stringify(_txn));

			// @ts-ignore:
			const signatureResponse = await window.lynxMobile.requestSignature(_txn);

			logIfDebugEnabled('signature: ' + signatureResponse.signatures[0]);

			const signatureArray = [ signatureResponse.signatures[0] ];
			const respone: RpcInterfaces.PushTransactionArgs = {
				signatures: signatureArray,
				serializedTransaction: signatureProviderArgs.serializedTransaction
			};

			// const signatureArray = [ '' ];
			// const respone: RpcInterfaces.PushTransactionArgs = {
			// 	signatures: signatureArray,
			// 	serializedTransaction: signatureProviderArgs.serializedTransaction
			// };

			return respone;
		}
	};
}

export function myWalletProvider() {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		// Connection

		function connect(appName: string): Promise<any> {
			logIfDebugEnabled('The connect method of myWallet was called');

			if (!window.hasOwnProperty('lynxMobile')) {
				throw new Error('Lynx wallet not detected');
			}

			const res = async function m2(): Promise<any> {
				return true;
			};
			return res();
		}

		function discover(discoveryOptions: DiscoveryOptions) {
			logIfDebugEnabled('The discover() method of myWallet was called');

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

			// @ts-ignore:
			const _accountName = await window.lynxMobile.requestSetAccountName();
			logIfDebugEnabled(_accountName);
			if (!_accountName) throw new Error('Account name was null');

			// @ts-ignore:
			const accountState = await window.lynxMobile.requestSetAccount(_accountName);
			if (!accountState) throw new Error('Account state was null');

			const perm = accountState.account.permissions.find((x: any) => x.perm_name === 'active');
			const publicKey: string = perm.required_auth.keys[0].key;
			accountPublickey = publicKey;

			logIfDebugEnabled(publicKey);

			return {
				accountName: _accountName,
				permission: 'active',
				publicKey
			};

			// TODO: Need a way to get the permission and publicKey for the selected account.
			// return {
			// 	accountName: 'eostransitio',
			// 	permission: 'active',
			// 	publicKey: 'EOS5ryMP4HXW4tHLyjxPv6DrhT25RVjwsACHnwijHdpkXPEA3CsQF'
			// };
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
