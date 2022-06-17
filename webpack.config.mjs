import path, { resolve }      from 'path'
import MiniCssExtractPlugin   from 'mini-css-extract-plugin'
import FileManagerPlugin      from 'filemanager-webpack-plugin'
import makeTemplatesPlugins   from './build/MakeTemplatesPlugins/index.js'
import FileListPlugin         from './build/FileListPlugin/index.js'
import customizeMinimizer     from './build/CustomizeMinimizer/index.js'
import ImageMultiFormatPlugin from './build/ImageMultiFormatPlugin/index.js'

let mode = 'development'
let target = 'web'
let isServer = process.env.WEBPACK_DEV_SERVER

if (process.env.NODE_ENV === 'production') {
	mode = 'production'
	target = 'browserslist'
}

export default {
	mode: mode,
	target: target,

	entry: {
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
				test: /\.(png|jpe?g|gif|webp|svg)$/i,
				type: 'asset/resource',
				generator: {
					// publicPath: (pathData) => {},
					// outputPath: (pathData) => {},
					filename: (pathData) => {
						let relativePath = pathData.module.resourceResolveData.relativePath
						let dirName = path.dirname(relativePath).replace('./src/', '')
						return dirName + '/[name][ext]'
					}
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

			// Templates
			{
				test: /\.hbs$/,
				use: [{
					loader: 'handlebars-loader',
					options: {
						helperDirs: [
							resolve('src/templates/base/helpers'),
						],
						partialDirs: [
							resolve('src/templates/layouts'),
							resolve('src/templates/partials'),
							resolve('src/templates/components'),
						],
						// debug: true,
						inlineRequires: '\/media\/' // resources copying
					}
				}]
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
					// copy: [{
					// 	source: resolve('src/media/*'),
					// 	destination: resolve('dist/media/')
					// }]
				}
			},
			runOnceInWatchMode: true
		}),

		...makeTemplatesPlugins({
			templatesPath: 'src/templates/'
		}),

		new FileListPlugin({
      outputFile: 'my-assets.md',
    }),

		new ImageMultiFormatPlugin()

	],

	optimization: {
    minimizer: [
      '...',
			customizeMinimizer()
    ]
  },

	resolve: {
		// extensions: ['.js', '.jsx'],
		alias: {
			handlebars: 'handlebars/dist/handlebars.js',
		}
	},

	devtool: 'source-map',

	stats: {
		children: false
	},

	devServer: {
		hot: true,
		port: 3000,
		static: {
			directory: resolve('dist')
		}
	}

}
