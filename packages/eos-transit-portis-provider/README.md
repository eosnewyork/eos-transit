# eos-transit-portis-provider

## Introduction

This is a plugin which is intended to be used in conjuntion with the EOS Transit API framework. 

Website: https://www.eostransit.com/  
EOS Transit, NPM: https://www.npmjs.com/package/eos-transit  
EOS Transit, Github: https://github.com/eosnewyork/eos-transit/tree/master/packages/eos-transit


## Links To This Package

NPM: https://www.npmjs.com/package/eos-transit-tokenpocket-provider  
Github: https://github.com/eosnewyork/eos-transit/tree/master/packages/eos-transit-tokenpocket-provider

## Implementation Details

👉🏻 **Please see the "Quick Start" and thorough guide in the [`eos-transit` package docs](https://github.com/eosnewyork/eos-transit/tree/master/packages/eos-transit)**

## Build Your Own Plugin
To build a plugin for your own signature provider to be included in the Transit API framework, please visit our in-depth tutorial here: https://github.com/eosnewyork/eos-transit/tree/master/plugin-dev/transit-dev-simple

## Usage

Node that this plugin requires a Dappid to initialize. See the last line in the below example.

```

const appName = 'My Dapp';

const walContext = initDefaultAccessContext({
	appName,
	network: {
		host: 'eos.greymass.com',
		port: 443,
		protocol: 'https',
		chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
	},

	walletProviders: [ 
		scatter(),
		portis({DappId: '0f987db7-f1f6-4ec6-bd8e-XXXXXXXXXX'}) ]
});

```

