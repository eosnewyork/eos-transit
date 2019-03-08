import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { WalletProvider, NetworkConfig, WalletAuth, DiscoveryOptions } from 'eos-transit';

const { scatter } = ScatterJS;

scatter.loadPlugin(new ScatterEOS());

export function makeSignatureProvider(network: NetworkConfig) {
	// 3rd param: beta3 = true
	return scatter.eosHook({ ...network, blockchain: 'eos' }, null, true);
}

// TODO: Ability to pass Scatter options
export function scatterWalletProvider() {
	return function makeWalletProvider(network: NetworkConfig): WalletProvider {
		// Connection

		function connect(appName: string): Promise<any> {
			return scatter.connect(appName, { initTimeout: 10000 }).then((connected: boolean) => {
				if (connected) return true;
				return Promise.reject('Cannot connect to Scatter');
			});
		}

		function discover(discoveryOptions: DiscoveryOptions) {
			// console.log('in scatter discover.');
			return new Promise((resolve, reject) => {
				let discoveryInfo = {
					keys: [],
					note: 'Scatter does not support discovery'
				};

				resolve(discoveryInfo);
			});
		}

		function disconnect(): Promise<any> {
			// TODO: Uncomment when Scatter implements this correctly
			// (probably by using `socket.close()` instead of `socket.disconnect()`)
			scatter.disconnect();
			return Promise.resolve(true);
		}

		// Authentication

		async function login(accountName?: string): Promise<WalletAuth> {
			try {
				// Useful for testnets to provide a convenient means for the end use to quickly add
				// the required network configuration to their Scatter seamlessly while logging in.
				await scatter.suggestNetwork({ ...network, blockchain: 'eos' });

				const identity = await scatter.getIdentity({
					accounts: [ { ...network, blockchain: 'eos' } ]
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

				return {
					accountName: account.name,
					permission: account.authority,
					publicKey: account.publicKey
				};
			} catch (error) {
				console.log('[scatter]', error);
				return Promise.reject(error);
			}
		}

		function logout(accountName?: string): Promise<any> {
			return scatter.forgetIdentity();
		}

		const walletProvider: WalletProvider = {
			id: 'scatter',
			meta: {
				name: 'Scatter Desktop',
				shortName: 'Scatter',
				description: 'Scatter Desktop application that keeps your private keys secure'
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

export default scatterWalletProvider;
