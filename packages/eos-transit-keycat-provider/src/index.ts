import { Api, ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';
import { Keycat } from 'keycatjs';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';

function logIfDebugEnabled(msg: string) {
	const debug = localStorage.getItem('DEBUG');
	if (debug === 'true') {
		console.log('IN WALLET: ' + msg);
	}
}

export function keycatWalletProvider() {



	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		let account: string|null;
		let publicKey: string|null;

		const { chainId } = network

		// This is a temporary solution, will be cleaned up so that any chanin can be used.  
		let keycatNetwork:string = '';
		if (chainId === 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906') {
			keycatNetwork = 'main'
		} else if (chainId === 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f') {
			keycatNetwork = 'jungle'
		} else {
			keycatNetwork = 'custom'
		}

		const nodeUrl = `${network.protocol}://${network.host}:${network.port}`;

		const keycat = new Keycat({
			blockchain: {
				name: 'eos',
				//@ts-ignore
				network: keycatNetwork,
				nodes: keycatNetwork === 'custom' ? [nodeUrl]: null,
			}
		})
		

		function connect(appName: string): Promise<any> {
			logIfDebugEnabled('The connect method of myWallet was called');
			return Promise.resolve(true);
		}

		function discover(discoveryOptions: DiscoveryOptions) {
			logIfDebugEnabled('The discover() method of myWallet was called');

			return new Promise((resolve) => {
				const discoveryInfo = {
					keys: [],
					note: 'Keycat wallet does not support discovery'
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

			const auth = await keycat.signin()
			publicKey = auth.publicKey
			account = auth.accountName
			return auth
		}

		function logout(accountName?: string): Promise<any> {
			publicKey = null
			account = null
			return Promise.resolve(true)
		}

		const walletProvider: WalletProvider = {
			id: 'Keycat',
			meta: {
				name: 'Keycat',
				shortName: 'Keycat',
				description: 'Keycat - A wallet in your browser'
			},
			signatureProvider: {
				
					async getAvailableKeys() {
						if (!publicKey) {
							throw new Error('Cannot use signature provider when you are not logged-in');
						}
						logIfDebugEnabled('In getAvailableKeys');
			
						logIfDebugEnabled('Return Key: ' + publicKey);
						const arr: string[] = [ publicKey ];
						return arr;
					},
			
					async sign(
						signatureProviderArgs: ApiInterfaces.SignatureProviderArgs,
						reason?: string
					): Promise<RpcInterfaces.PushTransactionArgs> {
						logIfDebugEnabled('In Sign');
						const rpcUrl = `${network.protocol}://${network.host}:${network.port}`;
			
						const api = new Api({
							rpc: new JsonRpc(rpcUrl),
							signatureProvider: this,
						})
			
						const tx = await api.deserializeTransactionWithActions(signatureProviderArgs.serializedTransaction)
						const sigresult = await keycat.account(account as string).signTransaction(tx);
						return sigresult;
					}
				
			},
			connect,
			discover,
			disconnect,
			login,
			logout,
			signArbitrary: function signArbitrary(data: string, userMessage: string): Promise<string> {
				return keycat.account(account).signArbitraryData(data);
			}

		};

		return walletProvider;
	};
}

export default keycatWalletProvider;

// force rebuild 2