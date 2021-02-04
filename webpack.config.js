const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let mode = process.env.NODE_ENV || 'development'
let target = mode === 'development' ? 'web' : 'browserslist'

module.exports = {
	mode: mode,

	output: {
		assetModuleFilename: 'images/[hash][ext][query]'
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
							publicPath: ''
						}
					},
					'css-loader',
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
							['@babel/preset-react', { runtime: 'automatic' }],
						]
					}
				}
			}

		]
	},

	plugins: [
		new MiniCssExtractPlugin()
	],

	resolve: {
		extensions: ['.js', '.jsx']
	},

	target: target,
	devtool: 'source-map',
	devServer: {
		contentBase: './dist',
		hot: true,
	}
}
