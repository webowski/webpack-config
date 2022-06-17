import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import sharpGenerate from './sharpGenerate.js'

class ImageMultiFormatPlugin {
	static defaultOptions = {
		outputFile: 'new-image.json'
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

			// let hooks = ImageMinimizerPlugin.getHooks(compilation)

			let hooks = compiler.hooks.thisCompilation.taps.filter( i => {
				return ['ImageMinimizerPlugin'].includes( i.name )
			})[0]

			compilation.hooks.processAssets.tap(
				{
					name: pluginName,
					stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
				},
				(assets) => {
					let source = ''

// 					// Object.entries(assets).forEach(([pathname, source]) => {
// 					// 	source = source + `— ${pathname}: ${source.size()} bytes \n`
// 					// 	source = source + `— ${pathname}: ${source.source()} bytes \n`
// 					// 	source = source + `— ${pathname}: ${JSON.stringify(source)} bytes \n`

// 					// 	if (pathname.find())
// 					// })
					// source = JSON.stringify(assets)


					// Assets list
					// =======================================
					this.options.outputFile = 'image-assets.md'
					for (let asset in assets) {
						// let assetText = JSON.stringify(assets[asset].buffer())
						// let assetText = JSON.stringify(assets[asset].source())
						// if (new RegExp(asset.test()))
						let assetText = JSON.stringify(asset)
						source = source + `${assetText}\n---\n`
					}


					// Inits sharpGenerate
					// =======================================
					// this.options.outputFile = 'new-image.jpg'
					// source = assets['images/bg.jpg'].source()


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

export {
	sharpGenerate
}
