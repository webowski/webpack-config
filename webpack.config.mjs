import fs                   from 'fs-extra'
import path, { resolve }    from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin    from 'html-webpack-plugin'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'
import FileManagerPlugin    from 'filemanager-webpack-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'

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
					},
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
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader-srcset'
					}
				]
			},
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

	optimization: {
    minimizer: [
      '...',

			new ImageMinimizerPlugin({
				deleteOriginalAssets: false,
				minimizer: {
          implementation: ImageMinimizerPlugin.squooshGenerate,
					filter: (source, sourcePath) => {
						console.log(sourcePath)
						return true
					},
          options: {
						resize: {
							enabled: true,
							width: 1980,
						},
						encodeOptions: {
							mozjpeg: {
								quality: 85
							},
						}
          }
        },
				generator: [

					{
						preset: '768',
						filename: '[name]@768[ext]',
						implementation: ImageMinimizerPlugin.squooshGenerate,
						options: {
							resize: {
								enabled: true,
								width: 768,
							},
							encodeOptions: {
								mozjpeg: {
									quality: 85
								}
							}
						}
					},

					{
						preset: '1280',
						filename: '[name][ext]',
						implementation: ImageMinimizerPlugin.squooshMinify,
						options: {
							resize: {
								enabled: true,
								width: 1280,
							},
							encodeOptions: {
								mozjpeg: {
									quality: 85
								}
							}
						}
					},

					{
						preset: '1980',
						filename: '[name]@1980[ext]',
						implementation: ImageMinimizerPlugin.squooshMinify,
						options: {
							resize: {
								enabled: true,
								width: 1980,
							},
							encodeOptions: {
								mozjpeg: {
									quality: 85
								}
							}
						}
					},

					{
						preset: 'webp768',
						filename: '[name]@768[ext]',
						implementation: ImageMinimizerPlugin.squooshGenerate,
            options: {
							resize: {
								enabled: true,
								width: 768,
							},
              encodeOptions: {
                webp: {
                  quality: 85,
                },
              },
            },
					},

					{
						preset: 'webp1280',
						filename: '[name][ext]',
						implementation: ImageMinimizerPlugin.squooshGenerate,
						options: {
							resize: {
								enabled: true,
								width: 1280,
							},
							encodeOptions: {
								webp: {
									quality: 85
								}
							}
						}
					},

					{
						preset: 'webp1980',
						filename: '[name]@1980[ext]',
						implementation: ImageMinimizerPlugin.squooshGenerate,
						options: {
							resize: {
								enabled: true,
								width: 1980,
							},
							encodeOptions: {
								webp: {
									quality: 85
								}
							}
						}
					},

				]
      })
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
