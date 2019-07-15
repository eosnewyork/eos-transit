import { initDefaultAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import ledger from 'eos-transit-ledger-provider';
import lynx from 'eos-transit-lynx-provider';
import tokenpocket from 'eos-transit-tokenpocket-provider';
import meetone from 'eos-transit-meetone-provider';
import metro from 'eos-transit-metro-provider';
import portis from 'eos-transit-portis-provider';
import whaleVault from 'eos-transit-whalevault-provider'
import keycat from 'eos-transit-keycat-provider'
import simplEOS from 'eos-transit-simpleos-provider'

const appName = 'My Dapp';

const walContext = initDefaultAccessContext({
	appName,
	network: {
		host: 'eos.greymass.com',
		port: 443,
		protocol: 'https',
		chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
	},
	// walletProviders: [ scatter() ]
	walletProviders: [ 
		scatter(),
		ledger({exchangeTimeout : 30000, transport: 'TransportWebBLE', name: 'Ledger Nano S BLE', shortName: 'Ledger Nano S BLE', id: 'ledgerble' }),
		ledger({exchangeTimeout : 30000, transport: 'TransportU2F', name: 'Ledger Nano S U2F', shortName: 'Ledger Nano S U2F', id: 'ledgeru2f' }),
		ledger({exchangeTimeout : 30000, transport: 'TransportWebAuthn', name: 'Ledger Nano S WebAuthn', shortName: 'Ledger Nano S WebAuthn', id: 'ledgeruwebauthn' }),
		ledger({exchangeTimeout : 30000, transport: 'TransportWebusb', name: 'Ledger Nano S Web USB', shortName: 'Ledger Nano S Web USB', id: 'ledgeruwebusb' }),
		lynx(),
		tokenpocket(),
		meetone(),
		metro(),
		portis({DappId: '0f987db7-f1f6-4ec6-bd8e-64672f8b5ac2'}),
		whaleVault(),
		keycat(),
		simplEOS() ]
});

// walContext.addWalletProvider(ledger({ pathIndexList: [ 0, 1, 2, 35 ] }));
// transport?: 'TransportWebAuthn' | 'TransportU2F | TransportWebBLE';
// name = 'Ledger Nano S',
// shortName = 'Ledger Nano S',
