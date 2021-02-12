const { resolve }            = require('path')
const chokidar               = require('chokidar')
const MiniCssExtractPlugin   = require('mini-css-extract-plugin')
const SVGSpritemapPlugin     = require('svg-spritemap-webpack-plugin')

const mode = process.env.NODE_ENV || 'development'
const target = mode === 'development' ? 'web' : 'browserslist'

module.exports = {
	mode: mode,

	context: resolve(__dirname),

	entry: {
		styles: './styles/index.scss',
		bundle: './scripts/index.js',
	},

	output: {
		path: resolve(__dirname),
		filename: 'scripts/[name].min.js',
		assetModuleFilename: 'images/[hash][ext][query]',
		chunkFilename: '[id].[chunkhash].js',
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
							publicPath: '',
						}
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: ['postcss-preset-env']
							}
						}
					},
					'sass-loader',
				]
			},

			// Images
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: 'asset/resource',
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
						cacheDirectory: true,
					}
				}
			},

		]
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: 'styles/[name].min.css',
		}),
		new SVGSpritemapPlugin('./images/icons/*.svg', {
			output: {
				filename: 'images/icons.svg'
			},
			sprite: {
				prefix: false
			}
		}),
	],

	resolve: {
		extensions: ['.js', '.jsx']
	},

	target: target,
	devtool: mode === 'development' ? 'source-map' : false,
	devServer: {
		before(app, server) {
			chokidar.watch([
				'./**/*.php',
				'./**/*.html',
			], {
				ignored: /node_modules/,
			}).on('all', function() {
				server.sockWrite(server.sockets, 'content-changed');
			})
		},
		port: 3000,
		// proxy: {
		// 	'/api': 'http://localhost:3000',
		// 	pathRewrite: { '^/api' : '' }
		// },
		// publicPath: '/',
		// hot: true,
		contentBase: resolve(__dirname),
		watchContentBase: true,
	}
}
