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
		const thisPlugin = this
		const pluginName = ImageMultiFormatPlugin.name
		const { webpack } = compiler
		const { Compilation } = webpack
		const { RawSource } = webpack.sources

		compiler.hooks.thisCompilation.tap(pluginName, thisPluginTapCallback)

		function thisPluginTapCallback(compilation) {
			compilation.hooks.processAssets.tap({
					name: pluginName,
					stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
				},
				processAssetsTapCallback.bind(null, compilation) // second argument will be the assets
			)
		}

		function processAssetsTapCallback() {
			let compilation = arguments[0]
			let assets = arguments[1]
			let source = ''

			for (let asset in assets) {
				let assetText = JSON.stringify(asset)
				source = source + `${assetText}\n---\n`
			}

			source = assets['images/bg.jpg'].source()

			compilation.emitAsset(
				thisPlugin.options.outputFile,
				new RawSource(source)
			)
		}

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
