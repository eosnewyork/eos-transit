# eos-ual-scatter-basic

This is an example of running a `transfer` transaction via Scatter (explicitly `Scatter Desktop` only).

## Quick start

### Prerequisites

1.  Make sure you have [`yarn`](https://yarnpkg.com) installed.
2.  Install [`parcel-bundler`](https://en.parceljs.org/getting_started.html) globally:

    With `yarn`:

        $ yard global add parcel-bundler

    or `npm`:

        $ npm install -g parcel-bundler

### Setup

1.  Install the dependencies:

        $ yarn install

1.5. **Important temporary step!** Now that its not published as a package yet, use [`yarn link`](https://yarnpkg.com/lang/en/docs/cli/link/) to link the main package to the project. Make sure the library itself is built (`npm run build` has run successfully and `lib` folder exists).

2.  Start the development server with:

        $ npm start

3.  Access the server at [`localhost:1234`](http://localhost:1234).
