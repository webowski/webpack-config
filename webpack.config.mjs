import fs                   from 'fs-extra'
import path, { resolve }    from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin    from 'html-webpack-plugin'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'
import FileManagerPlugin    from 'filemanager-webpack-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import CopyPlugin           from 'copy-webpack-plugin'

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
				test: /\.(png|jpe?g|gif|svg)$/i,
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
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: 'asset/resource',
				generator: {
					// publicPath: (pathData) => {},
					// outputPath: (pathData) => {},
					filename: (pathData) => {
						let relativePath = pathData.module.resourceResolveData.relativePath
						let dirName = path.dirname(relativePath).replace('./src/', '')
						return dirName + '/[name]@2x[ext]'
					}
				},
				loader: ImageMinimizerPlugin.loader,
				enforce: 'pre',
				options: {
					generator: [{
						preset: 'webp',
						type: 'import',
						implementation: ImageMinimizerPlugin.squooshGenerate,
						options: {
							encodeOptions: {
								webp: {
									quality: 90,
								},
							},
						},
					}],
				},
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

		...makeTemplatesPlugins()

	],

	// optimization: {
  //   minimizer: [
  //     // Extend default minimizer, i.e. `terser-webpack-plugin` for JS
  //     '...',
  //     // We recommend using only for the 'production' mode
  //     new ImageMinimizerPlugin({
	// 			deleteOriginalAssets: false,
  //       minimizer: {
  //         implementation: ImageMinimizerPlugin.squooshMinify,
  //         options: {
  //           // Your options for `squoosh`
  //         }
  //       }
	// 		}),
	// 		new ImageMinimizerPlugin({
	// 			deleteOriginalAssets: false,
	// 			generator: [{
	// 				// type: 'asset',
	// 				preset: 'webp',
	// 				// implementation: (original, options) => {
	// 				// 	console.log('original', original)
	// 				// 	console.log('options', options)
	// 				// 	// return {}
	// 				// },
	// 				filename: '[name][ext]',
	// 				implementation: ImageMinimizerPlugin.squooshGenerate,
	// 				options: {
	// 					encodeOptions: {
	// 						webp: {
	// 							quality: 90
	// 						}
	// 					}
	// 				}
	// 			}]
  //     }),
  //   ]
  // },

	resolve: {
		// extensions: ['.js', '.jsx'],
		alias: {
			handlebars: 'handlebars/dist/handlebars.js',
		}
	},

	devtool: 'source-map',

	stats: {
		children: true
	},

	devServer: {
		hot: true,
		port: 3000,
		static: {
			directory: resolve('dist')
		},
	}

}

function makeTemplatesPlugins() {

	const templates = fs
		.readdirSync(resolve('src/templates/'))
		.filter(filename => {
			return filename.match(/\.hbs/)
		})

	let templatesPlugins = []

	templates.forEach(templateName => {
		templatesPlugins.push(
			new HtmlWebpackPlugin({
				template: 'src/templates/' + templateName,
				filename: templateName.replace('.hbs', '.html'),
				minify: false,
				inject: false,
				templateParameters: JSON.parse(
					fs.readFileSync(resolve('src/templates/base/data.json'))
				),
				cache: true,
				alwaysWriteToDisk: true
			})
		)
	})

	templatesPlugins.push(
		new HtmlWebpackHarddiskPlugin
	)

	return templatesPlugins
}
