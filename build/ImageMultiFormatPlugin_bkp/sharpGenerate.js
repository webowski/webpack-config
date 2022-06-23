import path                 from 'path'
import sharp                from 'sharp'
import fs                   from 'fs-extra'

export default async function sharpGenerate(original, options) {
	const sharpStream = sharp(original.data)
		.resize({
			width: 768,
			withoutEnlargement: true,
		})

	const sharpPromises = []

	sharpPromises.push(
		sharpStream
			.clone()
			.toFormat('jpeg', { quality: 85 })
			.toBuffer({
				resolveWithObject: true
			})
	)

	let directory = path.dirname(original.filename)

	sharpPromises.push(
		fs.promises.mkdir(`dist/${directory}`, { recursive: true })
	)

	let webpFilePath = path.resolve('dist', changeExt(original.filename, 'webp'))
	sharpPromises.push(
		sharpStream
			.clone()
			.toFormat('webp', { quality: 85 })
			.toFile(addFileSuffix(webpFilePath, '@768'))
	)

	let pngFilePath = path.resolve('dist', changeExt(original.filename, 'png'))
	sharpPromises.push(
		sharpStream
			.clone()
			.toFormat('png', { quality: 85 })
			.toFile(addFileSuffix(pngFilePath, '@768'))
	)

	return Promise.all(sharpPromises)
		.then(results => {
			let { data, info } = results[0]
			// let outputExt = info.format
			let newFilename = changeExt(original.filename, 'jpg')
			newFilename = addFileSuffix(newFilename, '@768')

			return {
				filename: newFilename,
				data: data,
				warnings: [...original.warnings],
				errors: [...original.errors],
				info: {
					...original.info,
					generated: true,
					generatedBy: original.info && original.info.generatedBy ? ['sharp', ...original.info.generatedBy] : ['sharp']
				}
			}
		})
		.catch(error => {
			return {
				filename: original.filename,
				data: original.data,
				errors: [error],
				warnings: []
			}
		})
}

function changeExt(inputPath, newExt) {
	let inputExt = path.extname(inputPath).slice(1).toLowerCase()
	let outputPath = inputPath.replace(new RegExp(`${inputExt}$`), newExt)
	return outputPath
}

function addFileSuffix(inputPath, suffix) {
	let inputExt = path.extname(inputPath).toLowerCase()
	let outputPath = inputPath.replace(new RegExp(`${inputExt}$`), suffix + inputExt)
	return outputPath
}
