# wal-react-basic

This is an example of running a `transfer` transaction via WAL:E wallet providers (currently works via `Scatter Desktop` only).

## Quick start

### Prerequisites

Make sure you have [`yarn`](https://yarnpkg.com) installed.


### Setup

1.  Install the dependencies:

        $ yarn install
        
2. **Important temporary step!** The `wal-eos` is explicitly specified as a "link" right in the `package.json` for now, so make sure the `wal-eos` library itself is built (otherwise app won't work). Go to the root folder and run `yarn build` to do that.

3.  Start the development server with:

        $ yarn start

4.  Access the server at [`localhost:3300`](http://localhost:3300) (or whatever `PORT` you configured to run the development server for `create-react-app`).
