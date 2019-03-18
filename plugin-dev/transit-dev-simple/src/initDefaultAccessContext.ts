import { initDefaultAccessContext } from 'eos-transit';
import myWallet from './mywallet';

const appName = 'transit-dev-simple';

const walContext = initDefaultAccessContext({
	appName,
	network: {
		host: 'api.eosnewyork.io',
		port: 80,
		protocol: 'http',
		chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
	},
	walletProviders: [ myWallet() ]
});

// const walContext = initDefaultAccessContext({
// 	appName,
// 	network: {
// 		host: 'api.pennstation.eosnewyork.io',
// 		port: 7101,
// 		protocol: 'https',
// 		chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
// 	},
// 	walletProviders: [ myWallet() ]
// });
