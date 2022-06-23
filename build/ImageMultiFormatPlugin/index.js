const EXTS = {
  'jpeg': 'jpg',
  'jpg': 'jpg',
  'png': 'png',
  'webp': 'webp',
  'avif': 'avif',
}

class ImageMultiFormatPlugin {
	static defaultOptions = {
		outputFile: 'images/bg@processed.jpg',
		denyOriginalAssets: true,
	}

	constructor(options = {}) {
		this.options = { ...ImageMultiFormatPlugin.defaultOptions, ...options }
	}

	apply(compiler) {
		const thisClass = this
		const pluginName = ImageMultiFormatPlugin.name
		const { webpack } = compiler
		const { Compilation } = webpack
		const { RawSource } = webpack.sources

		const context = {
			thisClass,
			pluginName,
			compiler,
			webpack,
			Compilation,
			RawSource
		}

		compiler.hooks.thisCompilation.tap(pluginName, this.compilationTapCallback.bind(context))

		// compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
		// 	compilation.hooks.processAssets.tap(

		// 		{
		// 			name: pluginName,
		// 			stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
		// 		},

		// 		(assets) => {
		// 			let source = ''

		// 			let imageAssets = this.getImageAssets(assets)

		// 			source = assets['images/bg.jpg'].source()

		// 			compilation.emitAsset(
		// 				this.options.outputFile,
		// 				new RawSource(source)
		// 			)
		// 		}

		// 	)
		// })
	}

	compilationTapCallback(compilation) {
		let {
			thisClass,
			pluginName,
			compiler,
			webpack,
			Compilation,
			RawSource
		} = this

		compilation.hooks.processAssets.tap(

			{
				name: pluginName,
				stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
			},

			(assets) => {
				let source = ''

				let imageAssets = thisClass.getImageAssets(assets)

				source = assets['images/bg.jpg'].source()

				compilation.emitAsset(
					thisClass.options.outputFile,
					new RawSource(source)
				)
			}

		)
	}

	getImageAssets(assets) {
		// for (let asset in assets) {
		// 	let assetText = JSON.stringify(asset)
		// 	source = source + `${assetText}\n---\n`
		// }

		// let regExp = new RegExp(/\.(png|jpe?g|gif|webp|svg)$/i)

		// let imageAssets = Object.keys(assets).filter(assetName => {
		// })

		// Object.entries(assets).map(([filename, source]) => {
		// 		console.log(filename)
		// 	})

		// console.log(assets)
		// assets.filter(asset => {
		// 	return true
		// })
	}

	// formatImage(source) {
	// 	source = 'image'
	// 	return new Buffer.from(source)
	// }

	// addToAssets() {

	// }

	// saveImageFile() {

	// }
}

export default ImageMultiFormatPlugin
