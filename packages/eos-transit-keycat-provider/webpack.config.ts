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
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: 'eos-transit-tokenpocket-provider.min.js',
		path: path.resolve(__dirname, 'umd'),
		libraryTarget: 'umd',
		library: [ 'WAL', 'providers', 'tokenpocket' ],
		libraryExport: 'default'
	},
	plugins: [
		new ProvidePlugin({
			'window.WAL': [ 'eos-transit', 'default' ]
		})
	],
	externals: 'eosjs',
	stats: {
		colors: true
	}
};

export default config;
