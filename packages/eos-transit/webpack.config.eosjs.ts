import path from 'path';
import { Configuration, ProvidePlugin } from 'webpack';

const config: Configuration = {
  mode: 'production',
  entry: './node_modules/eosjs/dist/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'babel-preset-env',
              'babel-preset-stage-1',
              'babel-preset-es2015'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'eosjs.min.js',
    path: path.resolve(__dirname, 'umd'),
    libraryTarget: 'umd',
    library: 'eosjs'
  },
  stats: {
    colors: true
  }
};

export default config;
