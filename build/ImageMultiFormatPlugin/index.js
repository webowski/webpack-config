class ImageMultiFormatPlugin {
	static defaultOptions = {
		outputFile: 'new-image'
	}

	constructor(options = {}) {
		this.options = { ...ImageMultiFormatPlugin.defaultOptions, ...options }
	}

	apply(compiler) {
		const pluginName = ImageMultiFormatPlugin.name
		const { webpack } = compiler
		const { Compilation } = webpack
		const { RawSource } = webpack.sources

		compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
			compilation.hooks.processAssets.tap(
				{
					name: pluginName,
					stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
				},
				(assets) => {
					let source = ''

					// Object.entries(assets).forEach(([pathname, source]) => {
					// 	source = source + `— ${pathname}: ${source.size()} bytes \n`
					// 	source = source + `— ${pathname}: ${source.source()} bytes \n`
					// 	source = source + `— ${pathname}: ${JSON.stringify(source)} bytes \n`

					// 	if (pathname.find())
					// })
					// source = JSON.stringify(assets)

					for (let asset in assets) {
						// let assetText = JSON.stringify(assets[asset].buffer())
						// let assetText = JSON.stringify(assets[asset].source())
						let assetText = JSON.stringify(asset)
						source = source + `${assetText}\n\n\n
----------------------------------------------------\n\n\n`
					}

					source = JSON.stringify(compilation.hooks)
					// source = assets['media/hero.jpg'].source()

					compilation.emitAsset(
						this.options.outputFile,
						new RawSource(source)
					)

				}
			)
		})

	}
}

export default ImageMultiFormatPlugin
