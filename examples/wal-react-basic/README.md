# wal-react-basic

This is an example of running a `transfer` transaction via WAL:E wallet providers (currently works via `Scatter Desktop` only).

## Quick start

### Prerequisites

Make sure you have [`yarn`](https://yarnpkg.com) installed.

### Setup

1.  Install the dependencies.
   
    **Note** that before `wal-eos`, `wal-eos-scatter-provider` and `wal-eos-stub-provider` are published, they are managed by `lerna` along with packages themselves. That means, before running the examples, `lerna` should wire up all the dependencies and instead of running `yarn install` manually from this folder, the following commands should be run from the project root:

        $ yarn bootstrap
        $ yarn build-packages

    This will make `lerna` install all the necessary dependencies.

2.  Start the development server with (from this example folder root this time):

        $ yarn start

3.  Access the server at [`localhost:3300`](http://localhost:3300) (or whatever `PORT` you configured to run the development server for `create-react-app`).
