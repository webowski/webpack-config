const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let mode = process.env.NODE_ENV || 'development'
let target = mode === 'development' ? 'web' : 'browserslist'

const postcssOptions = {
	postcssOptions: {
		plugins: ['postcss-preset-env']
	}
}

module.exports = {
	mode: mode,

	module: {
		rules: [

			// Styles
			{
				test: /\.(s[ac]|c)ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: postcssOptions
					},
					'sass-loader',
				]
			},

			// Scripts
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}

		]
	},

	plugins: [
		new MiniCssExtractPlugin()
	],

	target: target,
	devtool: 'source-map',
	devServer: {
		contentBase: './dist',
		hot: true,
	}
}
