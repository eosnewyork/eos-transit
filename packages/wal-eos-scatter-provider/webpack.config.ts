import path from 'path';
import { Configuration, ProvidePlugin } from 'webpack';

const config: Configuration = {
  mode: 'production',
  entry: './src/index.ts',
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
  output: {
    filename: 'wal-eos-scatter-provider.min.js',
    path: path.resolve(__dirname, 'umd'),
    libraryTarget: 'umd',
    library: ['WAL', 'providers', 'scatter'],
    libraryExport: 'default'
  },
  plugins: [
    new ProvidePlugin({
      'window.WAL': ['wal-eos', 'default'],
      'window.ScatterJS': ['scatterjs-core', 'default'],
      'window.ScatterEOS': ['scatterjs-plugin-eosjs2', 'default']
    })
  ],
  externals: {
    'wal-eos': 'WAL',
    'scatterjs-core': 'ScatterJS',
    'scatterjs-plugin-eosjs2': 'ScatterEOS'
  },
  stats: {
    colors: true
  }
};

export default config;
