import path from 'path';
import { Configuration, ProvidePlugin } from 'webpack';

const commonConfig: Configuration = {
  mode: 'production',
  // entry: {
  //   'wal-eos': './src/index.ts',
  //   'wal-eos-scatter': './src/walletProviders/scatter/index.ts',
  //   'wal-eos-stub': './src/walletProviders/stub.ts'.
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.webpack.json'
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new ProvidePlugin({
      'window.ScatterJS': ['scatterjs-core', 'default'],
      'window.ScatterEOS': ['scatterjs-plugin-eosjs2', 'default']
    })
  ],
  externals: {
    'scatterjs-core': 'ScatterJS',
    'scatterjs-plugin-eosjs2': 'ScatterEOS'
  },
  stats: {
    colors: true
  }
};

const libConfig: Configuration = {
  ...commonConfig,
  entry: {
    'wal-eos': './src/index.ts'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'WAL',
    libraryExport: 'default'
  }
};

const providersConfig: Configuration = {
  ...commonConfig,
  entry: {
    scatter: './src/walletProviders/scatter/index.ts',
    stub: './src/walletProviders/stub.ts'
  },
  output: {
    filename: 'wal-eos-[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: ['WAL', 'providers', '[name]'],
    libraryExport: 'default',
    globalObject: 'window'
  }
};

export default [libConfig, providersConfig];
