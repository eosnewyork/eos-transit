# `eos-transit` - [Wallet Access Layer for EOS](../../) core package.

This library is a tiny abstraction layer on top of `eosjs` and is aiming to assist the EOS dapp (decentralized app) developers with wallet communication (in order to sign the transactions) by providing a simple and intuitive API.

This allows to concentrate on building awesome apps instead of setting up `eosjs` and wallet connections.

> *Disclaimer: This library is in early alpha. The core API has stabilized but some changes and extension should be expected. But we encourage to give it a try when building your decentralized apps and feel free to share any thoughts, doubts and concerns. Any kind of feedback is highly appreciated.*


## Features

- Easy to use API
- Managed wallet connection state tracking
- Easily pluggable wallet providers (and easy to write your own)
- TypeScript support
- Small footprint (core is just ~9Kb minified and around 2.7Kb gzipped)


## Packages

This is a monorepo that is managed with [`lerna`](https://github.com/lerna/lerna). There are several packages maintained here:

| Package                                                         | Version | Description                       |
|-----------------------------------------------------------------|---------|-----------------------------------|
| [`eos-transit`](../../packages/eos-transit)                                   | 0.0.1   | Transit core package                |
| [`eos-transit-scatter-provider`](../../packages/eos-transit-scatter-provider) | 0.0.1   | Wallet provider for [Scatter](https://get-scatter.com/) app |
| [`eos-transit-stub-provider`](../../packages/eos-transit-stub-provider)       | 0.0.1   | Stub wallet provider that does nothing, for demo and testing only |


---


## Table of Contents
- [`eos-transit` - Wallet Access Layer for EOS core package.](#eos-transit---wallet-access-layer-for-eos-core-package)
  - [Features](#features)
  - [Packages](#packages)
  - [Table of Contents](#table-of-contents)
  - [Quick start](#quick-start)
    - [Installation](#installation)
    - [Basic usage example](#basic-usage-example)
    - [Browser UMD build](#browser-umd-build)
  - [Motivation](#motivation)
  - [How it works (architecture)](#how-it-works-architecture)
  - [Guide](#guide)
    - [Basics](#basics)
      - [`WalletAccessContext` setup](#walletaccesscontext-setup)
      - [Setting up wallet providers](#setting-up-wallet-providers)
      - [Using `stub` wallet provider for testing and demo purposes](#using-stub-wallet-provider-for-testing-and-demo-purposes)
      - [Global `WalletAccessContext` instance](#global-walletaccesscontext-instance)
      - [Getting list of available wallet providers](#getting-list-of-available-wallet-providers)
    - [Working with wallets](#working-with-wallets)
      - [Creating `Wallet` instances](#creating-wallet-instances)
      - [Connecting to `Wallet`](#connecting-to-wallet)
      - [Logging in to a `Wallet`](#logging-in-to-a-wallet)
      - [Fetching user account data for a `Wallet`](#fetching-user-account-data-for-a-wallet)
      - [Working with EOS and signing transactions using `Wallet`](#working-with-eos-and-signing-transactions-using-wallet)
    - [State tracking](#state-tracking)
      - [Subscribing to the state updates](#subscribing-to-the-state-updates)
      - [`WalletAccessContext` state](#walletaccesscontext-state)
      - [`Wallet` state](#wallet-state)
    - [Wallet session termination](#wallet-session-termination)
    - [Destroying the `WalletAccessContext`](#destroying-the-walletaccesscontext)
    - [Creating custom wallet providers](#creating-custom-wallet-providers)
      - [Provider instance](#provider-instance)
      - [Provider factory function](#provider-factory-function)
      - [Higher-order provider factory function](#higher-order-provider-factory-function)
    - [TypeScript support](#typescript-support)
  - [API reference](#api-reference)
  - [Contribution](#contribution)


## Quick start

### Installation

`eos-transit` can be installed as an `npm` package using [`yarn`](https://yarnpkg.com/en/)

    $ yarn add eos-transit
    
or `npm` client:

    $ npm install eos-transit

Then simply `import` the package contents using the ES6 module syntax:

```
import { initAccessContext } from 'eos-transit';
```


### Basic usage example

Here's a simple quick start example using [Scatter](https://get-scatter.com) app wallet provider to get you up to speed but make sure to read the [Guide](#guide) for full explanation of how each part works and take a look at the [Architecture](#how-it-works-architecture) for better overall understanding.

Install the necessary libraries and wallet provider plugins with `yarn` (or `npm`):

```
$ yarn add eosjs@beta eos-transit eos-transit-scatter-provider
```

The `eos-transit-scatter-provider` will also pull its own dependencies automatically.

```javascript
import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';

// We need to initialize the so called "access context" first,
// passing it our dapp name, network configuration and
// providers we want to make available to the dapp.
// The context is responsible for initializing wallet connectoins
// and tracking state of connected wallets.

// We're using our own test network as an example here.
const accessContext = initAccessContext({
  appName: 'my_first_dapp',
  network: {
    host: 'api.pennstation.eosnewyork.io',
    port: 7001,
    protocol: 'http',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  },
  walletProviders: [
    scatter()
  ]
});

// We're all set now and can get the list of available wallet providers
// (we only have Scatter provider configured, so there will be only one):

const walletProviders = accessContext.getWalletProviders();
/* [{
 *   id: 'scatter',
 *   meta: {
 *    name: 'Scatter Desktop',
 *    shortName: 'Scatter',
 *    description: 'Scatter Desktop application that keeps your private keys secure'
 *   },
 *   signatureProvider,
 *   ... etc
 * }]
 */

// This list can be used to, e.g., show the "login options" to the user to let him choose
// what EOS login method he wants to use.

// We just take the one we have as if the user has selected that
const selectedProvider = walletProviders[0];

// When user selects the wallet provider, we initiate the `Wallet` with it:
const wallet = accessContext.initWallet(selectedProvider);

// Now we have an instance of `wallet` that is tracked by our `accessContext`.
// Lets connect to it and authenticate (you need Scatter app running)
// NOTE: Only use `await` inside the `async` function, its used here just to
// highlight that its asynchronous.
await wallet.connect();

// wallet.connected === true

// If we're dealing with a device that has multiple keys (eg. Ledger Nano S), then we'll need to discover which keys / accounts are available on the device. This will return an object containing an array of accounts ... you'll need the user to select which account he want to use if this is the case.
let discoveryData = await wallet.discover({ pathIndexList: [ 0,1,2 ] });

// Note you can keep caling discover at any point in time to extent the index list. transit will only query the device and the network for new index's. 
let discoveryData = await wallet.discover({ pathIndexList: [ 0,1,2,3 ] });
// You can either pass the full list or just the new index you're afer. Either way it'll append that keys info to the discoveryData object and return the entire dataset. 
let discoveryData = await wallet.discover({ pathIndexList: [ 150 ] });


// If we have more than one account the user can select from we'll need to prompt the user.
// Note that the Login function is called with the specific account details when multiple accounts are available.
if (discoveryData.keyToAccountMap.length > 0) {

  // If discover returned multiple acconts then you'll need to promot the user to select which account he'd like to use. 
  // accountName, authorization are taken from the  discoveryData object. See the example of this object further down on this page.

  await wallet.login(accountName, authorization)

} else {

  // Now that we are connected, lets authenticate (in case of a Scatter app,
  // it does it right after connection, so this is more for the state tracking
  // and for WAL to fetch the EOS account data for us)
  await wallet.login(); 

  
}


// wallet.authenticated === true
// wallet.auth === { accountName: 'some_user', permission: 'active', publicKey: '...' }
// wallet.accountInfo === { name: 'some_user', core_liquid_balance: ..., ram_quota: ..., etc... }

// Now that we have a wallet that is connected, logged in and have account data available,
// you can use it to sign transactions using the `eosjs` API instance that is automatically
// created and maintained by the wallet:

const eosAmount = 10;

wallet.eosApi
  .transact({
    actions: [
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [
          {
            actor: wallet.auth.accountName,
            permission: wallet.auth.permission
          }
        ],
        data: {
          from: wallet.auth.accountName,
          to: 'receiving_user',
          quantity: `${eosAmount.toFixed(4)} EOS`,
          memo: ''
        }
      }
    ]
  },
  {
    broadcast: true,
    blocksBehind: 3,
    expireSeconds: 60
  }
)
.then(result => {
  console.log('Transaction success!', result);
  return result;
})
.catch(error => {
  console.error('Transaction error :(', error);
  throw error;
});

```

Read about why would you need it in the [Motivation](#motivation) and explore more in the [Guide](#guide) section!


### Browser UMD build

There's also [UMD](https://github.com/umdjs/umd) build for in-browser usage distributed with the package that can be used by directly including the library as a `<script>` tag. It can either be referenced from inside the `eos-transit` package folder after being installed with `yarn` or `npm`:

    <script src="./node_modules/eos-transit/umd/eos-transit.min.js"></script>

or using [`unpkg`](https://unpkg.com) (will only work after `eos-transit` is published):

    <script src="https://unpkg.com/eos-transit/umd/eos-transit.min.js"></script>

> Note that you need to attach `eosjs` dependency as a `<script>` too which would require you to manually do a special "web build" (see the related [EOSJS docs here](https://eosio.github.io/eosjs/static/3.-Browsers.html)) but that build only exposes `eosjs` internals as global variables and doesn't work with `eos-transit` as the latter requires modules. **But we have you covered** and there's also custom `eosjs` UMD build that is pluggable as a `<script>` tag and can be `import`ed as a module:
> 
>     <script src="./node_modules/eos-transit/umd/eosjs.min.js"></script>
> OR
> 
>     <script src="./node_modules/eos-transit/umd/eosjs.min.js"></script>
>
> It isn't some custom `eosjs` tailored for `eos-transit`, its original `eosjs` code packaged nicely, so you don't have to.
>

There's also a [wal-script-tag](examples/wal-script-tag) example in our repo that showcases how to attach the libraries and how to use them to sign a transaction.

**Please note** that we highly encourage to use the ES modules version of the library and not the UMD build for real apps.


## Motivation

The need for `eos-transit` has formed up around realizing few issues with using EOS blockchain from the browser:

- `eosjs`, while being quite nice and feature-complete EOS blockchain integration for JavaScript, is rather low-level, and is tedious to setup for each particular dapp.

- Every wallet app to be represented as a login option or transaction signature provider for the dapp would need to integrate with `eosjs`, and dapp developer would need to introduce some level of abstraction for consistency purposes.

- When dapp developer gets to the point of supporting multiple wallets for authentication and transaction signing for end user to choose from (like `METRO` hardware wallet, `Scatter`, etc), he would need to setup the `eosjs` `Api` instances for each, track the connection/authentication state, user authentication data and EOS account data, handle connection errors, manage disconnected wallets, get the app notified when some wallet internal state changes, etc.

So, **Transit** just covers the above aspects for the dapp developer. Its basically nothing more than what a dapp developer **would have written on his own** in one way or another.

This lib's purpose is to ease the burden of setting up multiple signature providers by standardizing the approaches to how dapps talk to 3rd-party wallet apps and by tracking that communication. Basically, we're aiming to cover the entire "Login with EOS" use case for a dapp by making it as easy as installing few packages (core and necessary providers) and using the rather minimalistic API.


## How it works (architecture)

Transit is just a small convenience wrapper around `eosjs` (core) and some code that communicates to 3rd-party wallet apps for transactions signing (wallet providers). Its not extending the EOS blockchain, nor does it extend these 3rd-party apps, it just provides the consistent glue between these pieces of tech, also providing some assisting capabilities like state tracking for wallet connections.

The `eos-transit` is minimalistic and doesn't stand in a way, providing a lot of escape hatches (like there's always a reference to underlying `eosjs` `Api` instance available on `eos-transit` `wallet` instances) and only doing what its designed for.

There are 3 core pieces of `eos-transit`:

- `WalletAccessContext` is just a configured bunch of wallet providers in the context of a given **dapp** (identified by the passed **app name** when created) on a given **network** (defined with a passed network configuration). Keeps configured providers and is responsible for initializing `Wallet`s and tracking their state. Performs initial `eosjs` RPC access configuration.

- `WalletProvider` is a piece that communicates to a particular 3rd-party application. As the name implies, it "provides" the access to that app in a consistent manner (there's a `WalletProvider` API defined in `eos-transit`). Its not in any way bound to the `WalletAccessContext` - one can even use the `WalletProvider` instance directly if needed. Doesn't track state or anything, but provides the actual functionality to `connect()`, `login()` to the wallet, etc. The actual implementations are not the part of `eos-transit` core and are maintained and installed separately.

- `Wallet` represents a certain `WalletProvider` connection in a certain `WalletAccessContext`. It basically wraps the `WalletProvider` (there's a `provider` property on a `Wallet`) and adds some contextual metadata to that - it tracks if the `wallet` is connecting or authenticating, if its connected or authenticated, if there's a connection or authentication error and keeps the related data. The actual `eosjs` `Api` instance is created on the `Wallet` initialization and is maintained as an instance property.

See [Guide](#guide) and [API reference](#api-reference) for more information and elaborate type descriptions.


## Guide

This guide covers all the aspects of how `eos-transit` works step-by-step, so feel free to just follow it along.

### Basics

#### `WalletAccessContext` setup

The first thing in `eos-transit` setup is initializing `WalletAccessContext` instance. It takes an object of `options` that requires `appName`, `network` and `walletProviders` properties to be passed in:

```javascript
import { initAccessContext } from 'eos-transit';

const accessContext = initAccessContext({
  appName: 'my_dapp',
  network: {
    host: 'api.pennstation.eosnewyork.io',
    port: 7001,
    protocol: 'http',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  },
  walletProviders: []
});
```

And you're all set! Now use the newly created `accessContext` instance (that implements the `WalletAccessContext` interface) to initialize wallets. But wait! Shouldn't we pass something in the `walletProviders` array so that we can actually connect to some wallet app? Absolutely - lets see how to do that in the next section.


#### Setting up wallet providers

We'll use our official `eos-transit-scatter-provider` that connects to a [Scatter](https://get-scatter.com) wallet app. Our setup is extended to include the provider instance:

```javascript
import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';

const accessContext = initAccessContext({
  appName: 'my_dapp',
  network: {
    host: 'api.pennstation.eosnewyork.io',
    port: 7001,
    protocol: 'http',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  },
  walletProviders: [
    scatter()
  ]
});
```

Note that we're only passing `network` configuration to our `initAccessContext` and not into provider. The `scatter` in the example above is just a `default` export from our Scatter wallet provider package. Don't get confused, by calling this we're just initializing another function (that accepts `network`) that is then used by `eos-transit` to actually create a provider instance. We might have passed this function directly but this nice `eos-transit-scatter-provider` package creates one for us so that we don't have to.

For the curious, here's how that `scatter` function is looking internally:
```javascript
function scatter() {
  return function makeWalletProvider(network) {
    ...
    return scatterInstance;
  }
}
```

`eos-transit` then internally calls that at appropriate time and provides its `network` configuration. Pretty neat.


#### Using `stub` wallet provider for testing and demo purposes

There's one more provider we maintain as a package, `eos-transit-stub-provider` that **does nothing** and is there for purely demonstration and testing purposes. The `wallets` created with it always end up with error after specified timeout.

It will soon be extended to accept the pre-configured private key for `eosjs` `JsSignatureProvider` so that its more useful, but for now it just takes the following `options` object:

```javascript
{
  id: 'some_provider_id',
  name: 'My Super Cool Wallet Provider',
  shortName: 'My Provider',
  description: 'Some description here, might be shown on the UI, etc',
  errorTimeout: 3000 // milliseconds before connect/login error, defaults to 2500
}
```

Lets add that one as a wallet provider to our app too:

```javascript
import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import stub from 'eos-transit-~~tub~~-provider';

const accessContext = initAccessContext({
  appName: 'my_dapp',
  network: {
    host: 'api.pennstation.eosnewyork.io',
    port: 7001,
    protocol: 'http',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  },
  walletProviders: [
    scatter(),
    stub({
      id: 'some_provider_id',
      name: 'My Super Cool Wallet Provider',
      shortName: 'My Provider',
      description: 'Some description here, might be shown on the UI, etc',
      errorTimeout: 3000
    })
  ]
});
```

Sidenote: The function we export from our provider pacakges is also very helpful if we want to pass additional provider configuration options.

Once configured, our `stub` provider will reside amongst `walletProviders` inside the `WalletAccessContext` instance.


#### Global `WalletAccessContext` instance

A quick note about global `accessContext` maintained by `eos-transit`. You can (and most often should) create one yourself, and pass that to different parts of your app by the means of some UI lib/framework you're using (like `props` and "context" in `React`, etc). As many `WalletAccessContext` instances can be created as you'd like.

But for added convenience we also provide the one managed right by the `eos-transit` package. The catch is that you need to **initialize it first**, otherwise accessing the context throws an `Error` (we don't create one automatically because you might not need it and it needs `appName`, providers and network configured anyway). So, initialize it as soon as the app launches, before accessing anything else from the package.

The difference is in how you access that:

**Regular instance**

```javascript
// accessContext.js file
import { initAccessContext } from 'eos-transit';

const accessContext = initAccessContext(...);

...

export default accessContext;


// some-file1.js
import accessContext from './accessContext';

// Using `accessContext` ...


// some-file2.js
import accessContext from './accessContext';

// Using `accessContext` ...

```

**Global instance**

```javascript
// initAccessContext.js file
import { initDefaultAccessContext } from 'eos-transit';

const initDefaultAccessContext(...);

...

export default accessContext;


// app.js
// Need to initialize first
import './initAccessContext';
import './some-file1';
import './some-file2';

...

// some-file1.js
import WAL from 'eos-transit';

// Note that we're importing the context instance from `eos-transit`
// The instance is on `WAL.accessContext` ...

// some-file2.js
import WAL from 'eos-transit';

// The instance is on `WAL.accessContext` ...
```

The **recommended** approach is to use the custom instance, explicitly created with `initAccessContext`, though.


#### Getting list of available wallet providers

Now that `WalletAccessContext` instance is all set and ready, we can get a list of configured wallet providers from it:

```javascript
const walletProviders = accessContext.getWalletProviders();
```

You can use this list to show off to the user as some sort of login options (suggested approach). Then, upon some user action, certain provider can be considered "selected" and a `Wallet` instance would be created for it. Which naturally leads us to...


### Working with wallets

#### Creating `Wallet` instances

The `Wallet` represents the actual wallet app connection so to say. It represents a "wallet provider" in the context of a certain `appName` and `network`. That means, the `Wallet` instances are initialized with the help of previously created `WalletAccessContext` instance with certain `WalletProvider` as an argument:

```javascript
import { initAccessContext } from 'eos-transit';

const accessContext = initAccessContext({
  appName: '...',
  network: { ... },
  walletProviders: [ ... ]
});

// Selecting provider somehow, we just take the first in list for simplicity
const walletProvider = accessContext.getWalletProviders()[0];

const wallet = accessContext.initWallet(walletProvider);
```

You're all set to use the `Wallet`. Now you can connect to that wallet, login into it, obtain the authentication metadata and fetch the EOS account info with the help of `eos-transit`. All these actions are nicely tracked by the `Wallet` instances themselves and by `WalletAccessContext` which created that `Wallet`.


#### Connecting to `Wallet`

Once the `Wallet` instance is obtained, we can use it to connect to a wallet app. That is done with a `connect()` function, that returns a `Promise`, so you can either use `.then(...)` or `await` keyword (inside `async` functions only)

```javascript
// ...

const wallet = accessContext.initWallet(walletProvider);

wallet.connect()
  .then(() => {
    console.log('Successfully connected!')
  });

```

Some providers will also authenticate right when you're connecting to them, so the `login` will work instantly and will be used to only fetch the account data.

#### Logging in to a `Wallet`

A previously configured and `connected` wallet can be authenticated. Use `login()` function on a `Wallet` instance to do that. Just like `connect()`, it returns a `Promise`. But aside from calling `login` on the underlying `WalletProvider`, in case of successful login it also fetches the user account info

```javascript
// ...

const wallet = accessContext.initWallet(walletProvider);

wallet.connect().then(() => {
  console.log('Successfully connected!');

  wallet.login().then(accountInfo => {
    console.log(`Successfully logged in as ${accountInfo.name}!`);
  });
});


wallet.connect().then(() => {
  console.log('Successfully connected!');

    wallet.discover({ pathIndexList: [ 0,1,2,3 ] }).then((discoveryData: DiscoveryData) => {
    console.log('Discovery successfully completed!');

    // IF the wallet support discovery.
    // The discover process will return an object (see example object below) that contains:
    // 1. The keys found on the device
    // 2. The EOS Accounts linked to those keys. 
    //
    // If the keyToAccountMap contains entries, then the user should be asked which account they'd like to use. 
    // Note that the only functional difference is that:
    // When logging in with ledger you supply the account you want to login
    // When logging in with scatter your just calling login() and allowing the user to select an account
    if (discoveryData.keyToAccountMap.length > 0) {
      // We're just going to hard code the selection for the demo.
      const index = 0;
      const keyObj = discoveryData.keyToAccountMap[index];

      const accountName = keyObj.accounts[0].account;
      const authorization = keyObj.accounts[0].authorization;


      wallet.login(accountName, authorization).then(accountInfo => {
        console.log(`Successfully logged in as ${accountInfo.name}!`);
      });
    } else {
      // 0 keys returned, we need to user to select an account
      wallet.login().then(accountInfo => {
        console.log(`Successfully logged in as ${accountInfo.name}!`);
      });
    }
  });
});


```
The object returned from the discover() method looks as follows:

```
{
  keyToAccountMap: [{
    index: 0,
    key: XXXX,
    accounts: [{
        account: ‘eosio’,
        authorization: ‘owner’
    }]
  },{
    index: 1,
    key: YYYY,
    accounts: [{
        account: ‘anotherAccount’,
        authorization: ‘active’
    },{
        account: ‘anotherAccount’,
        authorization: ‘owner’
    }]
  }]
}

```

After the user is logged in, the `auth` metadata is available on the `wallet.auth` property. It contains `accountName`, `permission` (like `active`, `owner`, etc) and account's `publicKey`.

As well, because `eos-transit` also fetches the user account data (on successful logins) from EOS network itself, the `wallet.accountInfo` contains all the data returned from [EOS RPC API `get_account` endpoint](https://developers.eos.io/eosio-nodeos/reference#get_account).


#### Fetching user account data for a `Wallet`

Upon successful `login()` via the underlying `WalletProvider`, the `Wallet` instance fetches the EOS account info automatically and keeps in the internal state - its available on a `wallet.accountInfo` peroperty if fetched successfully.

But you can always refetch it manually with a `fetchAccountInfo()` function on a `Wallet` instance that returns a `Promise` of `AccountInfo`:

```javascript
// ...
wallet.fetchAccountInfo().then(accountInfo => {
  console.log(`Fetched the EOS account info for ${accountInfo.name}!`);
});
```

Aside from being returned in a `Promise`, it will also get remembered in the `Wallet` internal state.


#### Working with EOS and signing transactions using `Wallet`

The whole purpose of using 3rd-party wallet apps is for them to store user private key secure, so that it doesn't leak anywhere and only provide a signature when needed to sign a transaction before pushing that to the EOS blockchain network.

`eos-transit` doesn't change the way signatures are propagated to `eosjs` `Api` instance - instead, it just passes the `WalletProvider` instance `signatureProvider` property directly when creating the `eosjs` `Api` object for a `Wallet`.

`Wallet` object maintains the initialized and configured `Api` instance as the `eosApi` property. So, basically "connected" and "authenticated" `Wallet` is the dapp-level convenience, the real signatures are requested by the `eosjs` when there's the need to sign some transaction. `eos-transit` therefore just assists maintaining `Api` instance working and ready to sign transactions and in fact doesn't replace `eosjs` usage with some custom API (we'll be providing some purely convenience wrappers later on but they won't be a part of the `eos-transit` core per se).

Here's the example of using `eosio.token` contract transaction to transfer some `EOS` from the user currently authenticated with a `Wallet` and to some other user using `Api.transact(...)` (example is taken directly from [`eosjs` docs](https://github.com/EOSIO/eosjs#sending-a-transaction) and "ported" to use `eos-transit`):

```javascript
await wallet.connect();
await wallet.login();

wallet.eosApi
  .transact({
    actions: [
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [
          {
            actor: wallet.auth.accountName,
            permission: wallet.auth.permission
          }
        ],
        data: {
          from: wallet.auth.accountName,
          to: 'receiver_name',
          quantity: '10 EOS',
          memo: ''
        }
      }
    ]
  },
  {
    broadcast: true,
    blocksBehind: 3,
    expireSeconds: 60
  }
)
.then(result => {
  console.log('Transaction success!', result);
  return result;
})
.catch(error => {
  console.error('Transaction error :(', error);
  throw error;
});
```

Nothing special here really. Any other `eosjs` `Api` method can be used without issues on the instance exposed at the `eosApi` property.


### State tracking

This is the super-useful part of `eos-transit` and is basically something that would have to be implemented on the dapp side otherwise. Its UI frameworks agnostic and employs a very minimalistic state container internally, so no external dependencies are needed for this feature to work.

`eos-transit` keeps all the state related to `WalletAccessContext` and `Wallet` inside state containers in the respective `WalletAccessContext`/`Wallet` instances.


#### Subscribing to the state updates

In a real app its usually not enough to just perform some actions like `connect()`, `login()` or `fetchAccountInfo()` - for the sake of a smooth user experience, we need to store some additional metadata somewhere to know if the `wallet` is `connecting` or `authenticating` currently, or maybe there's `authenticationError` somewhere - these are all kinds of data to be stored *somewhere*. `eos-transit` keeps that in the internal state containers and that state is exposed as a `state` property on both `WalletAccessContext` and `Wallet` instances.

While the `state` property can be accessed directly at any time to inspect, its very handy to know *if* and, more importantly, *when* that state changes so that dapp can react accordingly, like rerender some piece of UI, etc.

This is done using `subscribe` function on both `WalletAccessContext` and `Wallet` instances. The listener of `WalletAccessContext.subscribe()` takes the access context itself as an argument and `Wallet.subscribe()` listener takes a new updated `WalletState`:

```javascript
const accessContext = initAccessContext(...);
accessContext.subscribe(walletAccessContext => {
  // walletAccessContext is here for added convenience,
  // you can use the `accessContext` too as its the same instance.
  // The point of subscription is mostly for the sake of knowing
  // "when" something changes.
  walletAccessContext === accessContext; // true

  console.log('access context state updated');
});

const wallet = accessContext.initWallet(someWalletProvider);
wallet.subscribe(walletState => {
  console.log(`wallet ${wallet._instanceId} state updated`);
});

// logs out "access context state updated"

wallet.connect();

// logs out "access context state updated"
// logs out "wallet <some_wallet_uuid> state updated"

// ... Later on when wallet has been connected

// logs out "access context state updated"
// logs out "wallet <some_wallet_uuid> state updated"

// etc

```


#### `WalletAccessContext` state

The `WalletAccessContext` instance state has only one property, which is `wallets`. That means that whenever 

```javascript
const accessContext = initAccessContext(...);
console.log(accessContext.state);
// {
//   wallets: []
// }

accessContext.initWallet(someWalletProvider);
console.log(accessContext.state);
// {
//   wallets: [Wallet]
// }

```

In most cases you won't need to access the `state` directly and would be using the like `getWalletProviders()`, `getWallets()` and `getActiveWallets()` instead.


#### `Wallet` state

Unlike `WalletAccessContext`, the `Wallet` state is much more elaborate. This is no surprise, since most of the "interesting" work happens at the `Wallet`s level.

```javascript
const accessContext = initAccessContext(...);
const wallet = initWallet(accessContext.getWalletProviders()[0]);

// wallet.state is the following object:
{
  // Whether the wallet is being connected
  connecting: false,

  // Whether the wallet is currently connected
  connected: false,

  // Whether there was a connection error
  connectionError: false,

  // if `connectionError === true`, there's usually some descriptive error message
  connectionErrorMessage: 'some error message',

  // In case of successful authentication, the object with auth metadata.
  // `undefined` otherwise.
  auth: {
    accountName: '...',
    permission: 'active',
    publicKey: '...'
  },

  // Whether the wallet is being authenticated
  authenticating: false,

  // Whether the wallet is authenticated
  authenticated: false,

  // Whether the authentication failed
  authenticationError: false,

  // Some auth error message if authentication failed
  authenticationErrorMessage: 'some auth error',

  // EOS account info if fetched successfully, `undefined` otherwise.
  accountInfo: void 0,

  // Whether the account info is being fetched for authenticated user
  accountFetching: false,

  // Whether there was an error during account info fetching
  accountFetchError: false,

  // Account fetching error description
  accountFetchErrorMessage: 'some account fetch error'
 }
```

While the `state` can be accessed directly, the most often used properties of `state` are also exposed on the `Wallet` instance directly:

```javascript
{
  ... other unrelated props,

  // Derived directly from `state`
  auth: { ... },
  accountInfo: { ... },
  connected: true,
  authenticated: true,

  // Whether there's something in progress - its either connecting,
  // authenticating or accountInfo is being fetched
  inProgress: true,

  // Whether its successfully connected, authenticated and
  // has accounInfo successfully fetched
  active: true,

  // Indicates either connection, authentication or accountInfo
  // fetching error, in that order or precedence
  hasError: false,

  // Either connection, authentication or accountInfo
  // fetching error message
  errorMessage: 'some error message',
}
```


### Wallet session termination

When all work is over, either individual `Wallet`s or all the `Wallet`s under certain `WalletAccessContext` need to tear down, logout and disconnect somehow.

There are `logout()` and `disconnect()` methods on the `Wallet` instance:

```javascript
const accessContext = initAccessContext(...);
const wallet = initWallet(accessContext.getWalletProviders()[0]);

// ... some useful stuff

await wallet.disconnect();
await wallet.logout();
```

Its all good and we've explicitly disconnected from the wallet provider app but our `WalletAccessContext` still maintains the `Wallet` instance since its still all valid - it can be `connect()`ed and `login()`ed again just like a fresh one.

To fix this, we need to "detach" the `Wallet` instance from the `WalletAccessContext` so that the latter "forgets" about the `Wallet` we want to dispose of:

```javascript

accessContext.detachWallet(wallet);
```

Its synchronous, invokes immediately and we're all set! So far so good but its so tedious doing that manually all the time, right? And most of the time we'd want to `logout` then immediately `disconnect` and then `detachWallet` right away. Totally agree, thats why there's convenient `terminate()` method that does all that for us:

```javascript
const accessContext = initAccessContext(...);
const wallet = initWallet(accessContext.getWalletProviders()[0]);

// ... some useful stuff

await wallet.terminate();
```

And thats it!

Alright, terminating individual `Wallet`s is perfect when we want to handle, e.g., user selectively logging out from certain wallets. But what if we want to provide some big red logout-and-disconnect-from-everything sort of button?

`WalletAccessContext` has few methods to cover this use case.

There are `logoutAll()`, `disconnectAll()` and, of course, `terminateAll()` methods on it - by calling those, we make the context `logout()`, disconnect()` or `terminate()` all managed wallets en masse.

### Destroying the `WalletAccessContext`

If you don't need the `WalletAccessContext` instance itself anymore, there's also `WalletAccessContext.destroy()` method that terminates all wallets managed by the context and also unsubscribes it from its own state container and removes all listeners.

Once `destroy()`ed, the `WalletAccessContext` should not be used anymore.


### Creating custom wallet providers

#### Provider instance

Creating custom `WalletProvider` is easy with `eos-transit`. The [`WalletProvider` `interface`](https://github.com/eosnewyork/eos-transit/blob/master/packages/eos-transit/src/types.ts#L68) can be used as a guide to what kind of object is expected as a `WalletProvider` instance even if you're not using TypeScript to write the actual provider.

The actual `WalletProvider` instance is an object:

```javascript
{
  // Unique identifier, e.g., "my_provider", or whatever won't clash with the existing ones
  id: 'awesome_provider',

  // Optional metadata property that can contain the optional fields 
  // such as provider `name`, `shortName` and `description`)
  meta: {
    name: 'My Super Awesome Wallet Provider',
    shortName: 'Awesome Provider',
    description: 'Just an Awesome Provider everyone using EOS gonna be using soon'
  },

  // Key part of the provider - `signatureProvider` is passed to `eosjs`
  // directly, when `Api` instance is created. It should be an object with
  // `getAvailableKeys` and `sign` methods.
  // Refer to `eosjs` docs for more information (link below the code)
  signatureProvider: {
    getAvailableKeys() { ... },
    sign(signatureProviderArgs) { ... }
  },

  // This method is used by `eos-transit` to connect to a provider.
  // Should return a Promise of anything. The method accepts the
  // `appName` as an argument so that the wallet app can, e.g.,
  // request from the user a permission for the certain app.
  connect(appName: string): Promise<any>;

  // Disconnects from the provider. Returns a Promise of anything,
  // just in case disconnection is some kind of process where provider
  // needs to receive an acknowledgement from the wallet app.
  disconnect(): Promise<any>;

  // Login is basically a way of "authenticating" the user with 
  // a wallet app. Please note that the notion of "authentication"
  // is different in decentralized world and its more for the
  // wallet app and user convenience. Should return a promise
  // of "authentication metadata" (`WalletAuth`).
  // There's an optional `accountName` argument in case some
  // provider authenticates or maintains some session for
  // a given account (e.g., when wallet app itself isn't maintaining
  // any kind of identity management, we need to let it know which
  // user we're authenticating as in the first place).
  login(accountName?: string): Promise<WalletAuth>;

  // Logouts the current user or a user with given `accountName`.
  // The user `accountName` argument is optional just like with `login`,
  // as not all wallets might need it.
  logout(accountName?: string): Promise<any>;
}
```

Here's the link to [`eosjs` `SignatureProvider` reference](https://eosio.github.io/eosjs/interfaces/api_interfaces.signatureprovider.html).

You can also check how our wallet provider packages are implemented:

- [`eos-transit-scatter-provider`](packages/eos-transit-scatter-provider/src/index.ts)
- [`eos-transit-stub-provider`](packages/eos-transit-stub-provider/src/index.ts)


#### Provider factory function

The above-described `WalletProvider` instance is whats being kept in the `eos-transit` state internally and is operated on. But before that happens, `eos-transit` needs to create the provider instance in the first place.

When `WalletAccessContext` is being created, the `walletProviders` array is used to pass the providers. But what is "providers" we pass in a `walletProviders` array? Note that its not a `WalletProvidier` instance but instead a function with the following signature:

```typescript
makeWalletProvider = (network: NetworkConfig) => WalletProvider
```

That means that we pass the function that accepts `network` configuration as an argument and returns a `WalletProvider` instance. And we pass these functions as a `walletProviders` array to `initAccessContext(...)`. So, the custom wallet provider package should implement this function.


#### Higher-order provider factory function

Its also advisable to create a higher order `function` (which is a `function` that returns another `function`). The `makeWalletProvider` function could be created by another function if there's any additional arguments we want to pass to the provider just like we do with our [`eos-transit-stub-provider`](packages/eos-transit-stub-provider/src/index.ts).

We encourage to use the higher-order factory functions for all custom providers for consistency:

```javascript
import { initAccessContext } from 'eos-transit';
import stub from 'eos-transit-stub-provider';
import scatter from 'eos-transit-scatter-provider';
import myProvider from 'my-own-provider-package';

const accessContext = initAccessContext({
  appName: '...',
  network: { ... },
  walletProviders: [
    stub({ ... }),
    scatter(),
    myProvider({ someOptionMaybe: 123 })
  ]
})
```

Good luck writing your own custom wallet provider!

### TypeScript support

[TODO]


## API reference

[TODO]


## Contribution

Please see the [Contribution Guide](https://github.com/eosnewyork/eos-transit/#contribution) in the root `README`.
