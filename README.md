# WAL:E - Wallet Access Layer for EOS blockchain networks.

[TODO: `lerna` monorepo note]

[TODO: Description]


## Quick start

[TODO]


## Guide

[TODO]


## API reference

[TODO]


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
