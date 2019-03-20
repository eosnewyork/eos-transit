### Transit PLUGIN Developer Kit

Most of the documentation for Transit API targets developers wanting to use the Transit API in their application. This document is targeted at developers wanting to build a Transit API wallet-provider plugin.

### Introduction

Writing a `transit` plugin is fairly simple, quite often however building the project and getting your development environment setup can be challenging.

The basic process to use this project is:

1.  *Clone the repo*
2.  *Switch to this folder cd plugin-dev\transit-dev-simple*
3.  *npm install*
4.  *Change the network setting and test account names to suit your liking.*
5.  *Update the skeleton (Details below)*
6.  *Start the test app*

npm start

or

HOST=10.10.5.5 npm start

If you need to need to load this URL into a mobile application/access it remotely then you will need it to listen on a specific IP address. Update 10.10.5.5 to match the IP you'd like to bind to.

Here's a quick demo of what to expect:

![](https://cdn-images-1.medium.com/max/800/0*KQAr5teF3AilCffp.png)

### 1\. Match your configuration

In the process of testing your wallet, the core transit framework will need to interact with an API endpoint. You'll want to configure this application to use the same EOS network /testnet as your wallet.

Edit `plugin-dev\transit-dev-simple\src\initDefaultAccessContext.ts` to match your test environment.

```
network: {		host: 'api.eosnewyork.io',		port: 80,		protocol: 'http',		chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'	}
```

### 2\. Update the Skeleton

Edit plugin-dev\transit-dev-simple\src\mywallet.ts

This file contains a skeleton framework. To get a fully working plugin all you need to do is update the following functions:

-   `connect()`
-   `login()`
-   `getAvailableKeys()`
-   `sign()`
-   `disconnect()`

These will be discussed in more detail shortly.

### 2.1. connect()

In most cases, this is a check to ensure that you're able to connect to your wallet.

### 2.2. login()

The primary purpose of this method is to return an object that represents an account to `transit`.

If your wallet supports multiple accounts, you should prompt the user to select one. Then return the `accountName`, `permission`, and `publicKey`, for the selected user.

```
return {                accountName: 'eostransitio',                permission: 'active',                publicKey: 'EOS5ryMP4HXW4tHLyjxPv6DrhT25RVjwsACHnwijHdpkXPEA3CsQF'        };
```

You may notice that the `login()` function can be called with a specific username. This is is only likely if the user selection process happens in the web UI itself. For example, Ledger Nano S returns an array of keys and the user picks an account in the web interface. In most cases, your UI will be asking the user to select an account or will default to an account, so it is safe to ignore any input to this function.

Please note that in most cases you will want to set a global variable containing the `publicKey` that was returned in this function. This will come in handy when implementing the next function `getAvailableKeys()`.

### 2.3. getAvailableKeys()

This function is called when `transit` / `eosjs` is trying to sign a transaction. It does not need to return all of the keys that your wallet has available to it, just the `publicKey` for the currently logged in user. As mentioned in 2.2, simply returning the same public key that you returned in the login method is all that's required in most cases.

### 2.4. sign()

There are generally two scenarios here:

#### 2.4.1 --- Your wallet support signing a serialized / packed transaction.

Simply forward the `signatureProviderArgs.serializedTransaction` value to your wallet and have the user confirm the fact that they would like to sign the transaction.

#### 2.4.2 --- Your wallet requires a deserialized transaction / some special formatting.

If you need to deserialize the transaction, you'll need to do the following:

1.  Install `eosjsv2` by running the following `npm install eosjs@20.0.0-beta3`- it should already be part of the package.json
2.  Add/uncomment the following line at the top of mywallet.ts `import { Api, ApiInterfaces, RpcInterfaces, JsonRpc } from 'eosjs';`
3.  Do the following to deserialize the transaction:

```
const rpc = new JsonRpc(network.protocol + '://' + network.host + ':' + network.port);const args = {        rpc,        authorityProvider: undefined,        abiProvider: undefined,        signatureProvider: this,        chainId: undefined,        textEncoder: undefined,        textDecoder: undefined};const api = new Api(args);const _txn = await api.deserializeTransactionWithActions(signatureProviderArgs.serializedTransaction);
```

Forward the `_txn` value to your wallet and have the user confirm the fact that they would like to sign the transaction.

### 2.5. disconnect()

As the name suggests, disconnect from your wallet/terminate variables that could be exploited later on.

### 3\. It works! Now what?

All that's left to do now is copy/paste your code into an official transit plugin. More detail will be provided on this soon. But for now, please ping @WarrickF in the [Transit API Telegram channel](https://t.me/TransitAPI) and assistance be can be provided for completing this step.
