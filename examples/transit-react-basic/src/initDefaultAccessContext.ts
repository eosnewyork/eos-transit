import { initDefaultAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import stub from 'eos-transit-stub-provider';
import ledger from 'eos-transit-ledger-provider';

const appName = 'my_eos_dapp';

initDefaultAccessContext({
  appName,
  network: {
    host: 'api.pennstation.eosnewyork.io',
    port: 7001,
    protocol: 'http',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  },
  walletProviders: [
    scatter(),
    stub({
      id: 'eos-metro',
      name: 'METRO™ Hardware Wallet',
      shortName: 'METRO™',
      description:
        'Use secure hardware private key vault to sign your transactions'
    }),
    ledger({
      id: 'ledger',
      name: 'ledger',
      shortName: 'Ledger',
      description:
        'Ledger XXXX'
    })
  ]
});
