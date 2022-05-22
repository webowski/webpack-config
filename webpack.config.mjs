import { resolve } from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

let mode = 'development'
let target = 'web'

if (process.env.NODE_ENV === 'production') {
	mode = 'production'
	target = 'browserslist'
}

export default {
	mode: mode,
	target: target,

	entry: {
		// styles: {
		// 	import: resolve('./src/styles/index.scss'),
		// 	filename: './styles/[name].min.js'
		// },
		bundle: {
			import: resolve('./src/scripts/index.js'),
			filename: './scripts/[name].min.js'
		}
	},

	module: {
		rules: [

			// Styles
			{
				test: /\.(scss|css)$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									['postcss-preset-env']
								]
							}
						}
					},
					'sass-loader'
				]
			},

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

	plugins: [

		new MiniCssExtractPlugin({
			filename: 'styles/styles.min.css',
		}),

	],

	devtool: 'source-map',
	devServer: {
		hot: true,
		static: {
			directory: resolve('dist')
		},
		// devMiddleware: {
		// 	writeToDisk : true
		// }
	},

	// optimization: {
	// 	// minimize: false,
	// 	// runtimeChunk: 'single',
	// 	runtimeChunk: {
	// 		name: 'runtime',
	// 	},
	// },

}
