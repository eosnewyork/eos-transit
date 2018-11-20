# WAL:E - Wallet Access Layer for EOS blockchain networks.

This library is a tiny abstraction layer on top of `eosjs` and is aiming to assist the EOS dapp (decentralized app) developers with wallet communication (in order to sign the transactions) by providing a simple and intuitive API.

This allows to concentrate on building awesome apps instead of setting up `eosjs` and wallet connections.

> *Disclaimer: This library is in early alpha. The core API has stabilized but some changes and extension should be expected. But we encourage to give it a try when building your decentralized apps and feel free to share any thoughts, doubts and concerns. Any kind of feedback is highly appreciated.*


👉🏻 **Please see the "Quick Start" and thorough guide in the [`wal-eos` package docs](packages/wal-eos)**


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
| [`wal-eos`](packages/wal-eos)                                   | 0.0.1   | WAL:E core package                |
| [`wal-eos-scatter-provider`](packages/wal-eos-scatter-provider) | 0.0.1   | Wallet provider for [Scatter](https://get-scatter.com/) app |
| [`wal-eos-stub-provider`](packages/wal-eos-stub-provider)       | 0.0.1   | Stub wallet provider that does nothing, for demo and testing only |


## Contribution

### Package development

1.  Make sure you have [`yarn`](https://yarnpkg.com) installed.

2.  Install the dependencies with

        $ yarn install
   
    **Note** that before `wal-eos`, `wal-eos-scatter-provider` and `wal-eos-stub-provider` are published, they are managed by `lerna` along with packages themselves. That means, before running the examples, `lerna` should wire up all the dependencies and instead of running `yarn install` manually from this folder, the following commands should be run from the project root:

3.  Bootstrap the dependencies with

        $ yarn bootstrap

    This will make `lerna` install all the necessary dependencies for managed packages.

4.  Proceed with the development of a certain package (each package has its own set of commands to assist the development and build process).


### Builds

To build all packages simultaneously, run the following command from the project root:

        $ yarn build-packages

This will perform both TypeScript compilation into `lib` folder and a minified production-ready UMD build into `umd` folder for each managed package.


### Publishing

1. First off, make sure the current state of package folders is consistent and packages that are about to be published are actually built (with `yarn build-packages`, see previous section). To make sure, you can run `yarn pack` command to create a `tgz` tarball of the package and inspect its contents (but make sure that doesn't leak to a published package, so cleanup that before publishing).

2. Make sure you're logged into `npm` registry by running [`yarn login`](https://yarnpkg.com/lang/en/docs/cli/login/) but note that this won't ask you a password (it will be asked upon publishing, since `yarn` doesn't maintain authenticated sessions with `npm` registry):

3. Since this monorepo is managed with `lerna`, the latter is responsible for publishing too, so run 

        $ lerna publish

    possibly proividing [additional options](https://github.com/lerna/lerna/tree/master/commands/publish) if needed.

    Normally, this should guide you through version bumping process as well as creating and pushing new `git` version tags for each package that had been published.
