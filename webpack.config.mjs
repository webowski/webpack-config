import path, { resolve }    from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import FileManagerPlugin    from 'filemanager-webpack-plugin'

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
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../'
						}
					},
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

			// Images
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: 'asset/resource',
				generator: {
					// publicPath: (pathData) => {
					// 	// // let assetPath = pathData.module.resourceResolveData.relativePath
					// 	// let assetPath = pathData.filename
					// 	// // let dirName = path.dirname(assetPath).replace('./src/', '')
					// 	// let dirName = path.dirname(assetPath).replace('src/', '')
					// 	// // return dirName

					// 	// let assetPath = pathData.module.resourceResolveData.relativePath
					// 	// let dirName = path.dirname(assetPath).replace('./src/', '')
					// 	// return dirName + '/[name][ext]'
					// 	return 'publicPath'
					// },
					// outputPath: (pathData) => {
					// 	// let assetPath = pathData.module.resourceResolveData.relativePath
					// 	// let assetPath = pathData.filename
					// 	// let dirName = path.dirname(assetPath).replace('./src/', '')
					// 	// let dirName = path.dirname(assetPath).replace('src/', '')
					// 	return 'dist'
					// },
					filename: (pathData) => {
						let relativePath = pathData.module.resourceResolveData.relativePath
						let dirName = path.dirname(relativePath).replace('./src/', '')
						return dirName + '/[name][ext]'
					},
				}
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

		new FileManagerPlugin({
			events: {
				onEnd: {
					copy: [
            {
							source: resolve('src/media/*'),
							destination: resolve('dist/media/')
						},
          ],
					// delete: [
					// 	resolve(__dirname + '/dist/styles/styles.min.js*')
					// ]
				}
			}
		})

	],

	devtool: 'source-map',
	devServer: {
		hot: true,
		static: {
			directory: resolve('dist')
		},
	}

}
