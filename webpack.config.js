
let mode = process.env.NODE_ENV || 'development'
let target = mode === 'development' ? 'web' : 'browserslist'

module.exports = {
	mode: mode,

	module: {
		rules: [

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

	devtool: 'source-map',
	devServer: {
		contentBase: './dist'
	}
}
