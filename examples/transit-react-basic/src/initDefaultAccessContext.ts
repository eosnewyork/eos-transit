import { initDefaultAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import ledger from 'eos-transit-ledger-provider';
import lynx from 'eos-transit-lynx-provider';
import tokenpocket from 'eos-transit-tokenpocket-provider';

const appName = 'my_eos_dapp';

const walContext = initDefaultAccessContext({
	appName,
	network: {
		host: 'api.eosnewyork.io',
		port: 80,
		protocol: 'http',
		chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
	},
	// walletProviders: [ scatter() ]
	walletProviders: [ scatter(), ledger(), lynx(), tokenpocket() ]
});

// walContext.addWalletProvider(ledger({ pathIndexList: [ 0, 1, 2, 35 ] }));
