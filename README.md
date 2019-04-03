# Transit - Wallet Access Layer for EOSIO blockchain networks.

This library is a small abstraction layer on top of `eosjs` which aims to assist EOS dApp (decentralized app) developers with wallet communication (signature verification and acceptance) by providing a simple and intuitive API.

Instead of focusing on supporting specific signature providers one by one, developers can support every one that has built a Transit plugin, allowing the user to use their signature provider of choice. This way, the best UX for signature providers wins and the developers can focus on building their dApp instead of setting up `eosjs` and wallet connections.

👉🏻 **Please see the "Quick Start" and thorough guide in the [`eos-transit` package docs](packages/eos-transit)**


## Features

- Easy to use API.
- Managed wallet connection state tracking
- Easily pluggable wallet providers (and easy to write your own)
- TypeScript support
- Small footprint (core is just ~9Kb minified and around 2.7Kb gzipped)


## Packages

This is a monorepo that is managed with [`lerna`](https://github.com/lerna/lerna).  

Wallet providers have the option to add their plugin to this repo via pull request, or they maintain it within their own repo. 

| Package                                                                         | Version | Description                       |
|---------------------------------------------------------------------------------|---------|-----------------------------------|
| [`eos-transit`](packages/eos-transit)                                           | 3.0.x   | Transit core package                |
| [`eos-transit-scatter-provider`](packages/eos-transit-scatter-provider)         | 3.0.x   | Wallet provider for [Scatter](https://get-scatter.com/) app |
| [`eos-transit-lynx-provider`](packages/eos-transit-lynx-provider)               | 3.0.x   | Wallet provider for [Lynx](https://eoslynx.com/) app |
| [`eos-transit-ledger-provider`](packages/eos-transit-ledger-provider)           | 3.0.x   | Wallet provider for [Ledger](https://www.ledger.com/) app |
| [`eos-transit-tokenpocket-provider`](packages/eos-transit-tokenpocket-provider) | 3.0.x   | Wallet provider for [Token Pocket](https://www.tokenpocket.pro/) app |
| [`eos-transit-meetone-provider`](https://github.com/meet-one/eos-transit-meetone-provider) | ???   | Wallet provider for [MEET.ONE](https://meet.one/) app |
| [`eos-transit-stub-provider`](packages/eos-transit-stub-provider)               | 3.0.x   | Stub wallet provider that does nothing, for demo and testing only |


## Contribution

The below instructions only apply to developers wishing to build the transit project. In most cases developers will want to pull the NPM pakckages. 

If you're wanting to USE eos-transit and plugins:

 👉🏻 **Please see the "Quick Start" and thorough guide in the [`eos-transit` package docs](packages/eos-transit)**

If you are looking to build your own plugin, the [Transit PLUGIN Developer Kit](/eosnewyork/eos-transit/tree/master/plugin-dev/transit-dev-simple) is a good place to start. 

### Package development

1.  Make sure you have [`yarn`](https://yarnpkg.com) installed.

2.  Install the dependencies with

        $ yarn install
   
    **Note** that before `eos-transit`, `eos-transit-scatter-provider` and `eos-transit-stub-provider` are published, they are managed by `lerna` along with packages themselves. That means, before running the examples, `lerna` should wire up all the dependencies and instead of running `yarn install` manually from this folder, the following commands should be run from the project root:

3.  Bootstrap the dependencies with

        $ yarn bootstrap

    This will make `lerna` install all the necessary dependencies for managed packages.

4.  Proceed with the development of a certain package (each package has its own set of commands to assist the development and build process).


### Builds

To build all packages simultaneously, run the following command from the project root:

        $ yarn build-packages

This will perform both TypeScript compilation into `lib` folder and a minified production-ready UMD build into `umd` folder for each managed package.


### Publishing

1. Make sure the current state of package folders is consistent and that packages which are about to be published are actually built (with `yarn build-packages`, see previous section). To make sure, you can run `yarn pack` command to create a `tgz` tarball of the package and inspect its contents (but make sure that doesn't leak to a published package, so cleanup that before publishing).

2. Make sure you're logged into `npm` registry by running [`yarn login`](https://yarnpkg.com/lang/en/docs/cli/login/). Please note that this won't ask you for a password (it will be asked upon publishing, since `yarn` doesn't maintain authenticated sessions with `npm` registry):

3. Since this monorepo is managed with `lerna`, the latter is responsible for publishing too, so run:

        $ lerna publish

    possibly proividing [additional options](https://github.com/lerna/lerna/tree/master/commands/publish) if needed.

    Normally, this should guide you through version bumping process as well as creating and pushing new `git` version tags for each package that had been published.
