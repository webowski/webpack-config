const path                   = require('path')
const MiniCssExtractPlugin   = require('mini-css-extract-plugin')
// const HtmlWebpackPlugin      = require('html-webpack-plugin')
const SVGSpritemapPlugin     = require('svg-spritemap-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')

let mode = process.env.NODE_ENV || 'development'
let target = mode === 'development' ? 'web' : 'browserslist'

module.exports = {
	mode: mode,

	entry: './scripts/index.js',

	output: {
		path: __dirname,
		filename: 'scripts/bundle.min.js',
		assetModuleFilename: 'images/[hash][ext][query]',
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
				// type: 'asset',
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
			}

		]
	},

	plugins: [
		// new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'styles/[name].min.css',
		}),
		// new HtmlWebpackPlugin({
		// 	template: './templates/index.html'
		// }),
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
	devtool: 'source-map',
	devServer: {
		contentBase: './',
		hot: true,
	}
}
