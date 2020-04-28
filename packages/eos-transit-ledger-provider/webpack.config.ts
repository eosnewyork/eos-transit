import path from 'path';
import { Configuration, ProvidePlugin } from 'webpack';

const config: Configuration = {
	mode: 'production',
	target: 'node',
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
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: 'eos-transit-ledger-provider.min.js',
		path: path.resolve(__dirname, 'umd'),
		libraryTarget: 'umd',
		library: [ 'WAL', 'providers', 'ledger' ],
		libraryExport: 'default'
	},
	plugins: [
		new ProvidePlugin({
			'window.WAL': [ 'eos-transit', 'default' ],
			_hwTransport2: [ '@babel/runtime/regenerator' ]
		})
	],
	externals: 'eosjs', 
	stats: {
		colors: true
	}
};

export default config;
