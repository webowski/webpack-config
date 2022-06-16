import fs                   from 'fs-extra'
import path, { resolve }    from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin    from 'html-webpack-plugin'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'
import FileManagerPlugin    from 'filemanager-webpack-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import measureImage         from 'buffer-image-size'
import sharp                from 'sharp'

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

		...makeTemplatesPlugins()

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

function customizeMinimizer() {
	const NORMAL_IMAGE_WIDTH = 1280

	const ENCODE_OPTIONS = {
		JPG: {
			mozjpeg: {
				quality: 85
			}
		},
		PNG: {
			pngquant: {
				quality: .85
			}
		},
		WEBP: {
			webp: {
				quality: 85,
			}
		}
	}

	function makePreset({ name, width, format }) {
		format = format.toUpperCase()

		let suffix = (width === NORMAL_IMAGE_WIDTH) ? '' : `@${width}`

		return {
			preset: name,
			filename: `[name]${suffix}[ext]`,
			implementation: ImageMinimizerPlugin.squooshGenerate,
			options: {
				resize: {
					enabled: true,
					width: width,
				},
				encodeOptions: ENCODE_OPTIONS[format]
			}
		}
	}

	// function filterByWidth(width = NORMAL_IMAGE_WIDTH) {
	// 	return (source, sourcePath) => {
	// 		let originalWidth = measureImage(source).width
	// 		if (originalWidth <= width) return false
	// 		return true
	// 	}
	// }

	return new ImageMinimizerPlugin({
		deleteOriginalAssets: true,
		// loader: false,
		// concurrency: 3,
		generator: [

			{
				type: 'asset',
				implementation: sharpGenerate,
				// options: {
				// 	encodeOptions: ENCODE_OPTIONS.WEBP
				// },
				// filename: (pathData, assetInfo) => {
				// 	return '[path][name][ext]'
				// }
			},

			makePreset({name: '768', width: 768, format: 'jpg'}),
			makePreset({name: '1280', width: 1280, format: 'jpg'}),
			makePreset({name: '1980', width: 1980, format: 'jpg'}),
			makePreset({name: 'webp768', width: 768, format: 'webp'}),
			makePreset({name: 'webp1280', width: 1280, format: 'webp'}),
			makePreset({name: 'webp1980', width: 1980, format: 'webp'}),

		]
	})
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

async function sharpGenerate(original, options) {
	const sharpStream = sharp(original.data)
		.resize({
			width: 768,
			withoutEnlargement: true,
		})

	const sharpPromises = []

	sharpPromises.push(
		sharpStream
			.clone()
			.toFormat('jpeg', { quality: 85 })
			.toBuffer({
				resolveWithObject: true
			})
	)

	let webpFilePath = path.resolve('dist', changeExt(original.filename, 'webp'))
	sharpPromises.push(
		sharpStream
			.clone()
			.toFormat('webp', { quality: 85 })
			.toFile(webpFilePath)
	)

	let pngFilePath = path.resolve('dist', changeExt(original.filename, 'png'))
	sharpPromises.push(
		sharpStream
			.clone()
			.toFormat('png', { quality: 85 })
			.toFile(pngFilePath)
	)

	return Promise.all(sharpPromises)
		.then(results => {
			let { data, info } = results[0]
			// let outputExt = info.format
			let newFilename = changeExt(original.filename, 'jpg')

			return {
				filename: newFilename,
				data: data,
				warnings: [...original.warnings],
				errors: [...original.errors],
				info: {
					...original.info,
					generated: true,
					generatedBy: original.info && original.info.generatedBy ? ['sharp', ...original.info.generatedBy] : ['sharp']
				}
			}
		})
		.catch(error => {
			return {
				filename: original.filename,
				data: original.data,
				errors: [error],
				warnings: []
			}
		})
}

function changeExt(inputPath, newExt) {
	let inputExt = path.extname(inputPath).slice(1).toLowerCase()
	let outputPath = inputPath.replace(new RegExp(`${inputExt}$`), newExt)
	return outputPath
}
