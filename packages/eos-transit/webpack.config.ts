import path from 'path';
import { Configuration } from 'webpack';

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
    filename: 'eos-transit.min.js',
    path: path.resolve(__dirname, 'umd'),
    libraryTarget: 'umd',
    library: 'WAL',
    libraryExport: 'default'
  },
  externals: 'eosjs',
  stats: {
    colors: true
  }
};

export default config;
