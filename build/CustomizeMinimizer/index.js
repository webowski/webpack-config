import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import measureImage         from 'buffer-image-size'
import { sharpGenerate }    from '../ImageMultiFormatPlugin/index.js'

export default function customizeMinimizer() {
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
