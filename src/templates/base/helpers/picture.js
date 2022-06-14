const path        = require('path')
const Handlebars  = require('handlebars')
const { match } = require('assert')
const __dir       = path.resolve('src')

class PathsGen {
	initial
	srcset
	srcsetWebp

	constructor(src) {

		this.initial = src.replace('@2x', '')
		let pathWebp = this.initial.replace(/\.jpg|\.png/, '.webp')
		let is2x = src.match(/@2x/)

		if (is2x) {
			let pathWebp2x = src.replace(/\.jpg|\.png/, '.webp 2x')
			let path2x = src + ' 2x'
			this.srcset = `${this.initial}, ${path2x}`
			this.srcsetWebp = `${pathWebp}, ${pathWebp2x}`
		} else {
			this.srcset = this.initial
			this.srcsetWebp = pathWebp
		}

	}
}

function makeAttributesString(obj) {
	let attributes = []

	Object.keys(obj).forEach(key => {
		let escapedKey = Handlebars.escapeExpression(key)
		let escapedValue = Handlebars.escapeExpression(obj[key])
		attributes.unshift(escapedKey + '="' + escapedValue + '"')
	})

	attributes = attributes.join(' ')
	return attributes
}

function getSrc(attributeName, options) {
	let src
	let width = getWidth(attributeName)

	if (options.hash.hasOwnProperty(attributeName)) {
		src = `${options.hash[attributeName]} ${width}w`
	}

	return src
}

function getWidth(attribute) {
	let regExp = new RegExp(/src\:[a-z]*(\d*)/)
	let width = regExp.exec(attribute)[1]
	return width
}

const DEFAULT_FORMAT = 'jpg'
const DEFAULT_WIDTH = 1280

function getFormat(attribute) {
	let regExp = new RegExp(/src\:?([a-z]*)(\d*)/)
	let result = regExp.exec(attribute)
	let format = result[1] || DEFAULT_FORMAT
	let width = result[2] || DEFAULT_WIDTH

	return [
		attribute,
		format,
		width
	]
}

function makeSrcset(attributes) {
	attributes.forEach((src, index) => {

	})

	// srcs = srcs.join(', ')
	attributes.join(', ')
	return srcset
}

function filterAttributes(options) {
	let srcs = []

	for (let attribute in options.hash) {
		if (attribute.match(/^src/)) {
			srcs.push(attribute)
			// console.log(options.hash[attribute])
			// delete options.hash[attribute]
		}
	}

	return srcs
}

module.exports = function(options) {
	let src = options.hash.src
	delete options.hash.src

	let pths = {}
	pths['srcset'] = getSrc('src:768', options)

	let srcs = filterAttributes(options)

	let altText = ''
	if (options.hash.hasOwnProperty('alt')) {
		altText = options.hash.alt
		delete options.hash.alt
	}

	let attributes = makeAttributesString(options.hash)
	let paths = new PathsGen(src)

	// // let images = getImages(src)
	// // let imageSrc = path.resolve(__dir, 'media/hero.jpg')

	// let imports = []
	// let presets = ['1x', 'sm', 'webp1x', 'webpSm']

	// if (1 == 1) {
	// 	// import(/* webpackMode: "eager" */ '../../../media/hero.jpg?as=webp1x').then((module) => {})

	// 	presets.forEach(preset => {
	// 		imports.push(
	// 			`\nimport(/* webpackMode: "eager" */ '${imageSrc}?as=${preset}');`
	// 		)
	// 	})
	// }

	// imports = imports.join(' ')

	let width2 = getWidth('src:768')
	// let format = getFormat('src:webp768')
	let [attribute, format, width] = getFormat('src')

	let output = `<picture ${attributes}>
		<source srcset="${paths.srcsetWebp}" type="image/webp">
		<img src="${paths.initial}" srcset="${pths['srcset']}" alt="${altText}">
	</picture>
	${format}
	${width}
	${srcs}`

	return new Handlebars.SafeString(output)
}
