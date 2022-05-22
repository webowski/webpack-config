import { resolve } from 'path'

let mode = 'development'

if (process.env.NODE_ENV === 'production') mode = 'production'

export default {
	mode: mode,

	module: {
		rules: [

			// Scripts
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
						],
						// cacheDirectory: true
					}
				}
			},

		]
	},

	devtool: 'source-map',
	devServer: {
		static: {
			directory: resolve('dist')
		}
	}
}
