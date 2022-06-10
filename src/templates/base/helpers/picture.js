const { resolve } = require('path')
const path = require('path')
const Handlebars  = require('handlebars')
var loaderUtils = require("loader-utils")

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

module.exports = function(options) {
		let src = options.hash.src
		delete options.hash.src

		let altText = ''
		if (options.hash.hasOwnProperty('alt')) {
			altText = options.hash.alt
			delete options.hash.alt
		}

		let attributes = makeAttributesString(options.hash)
		let paths = new PathsGen(src)

		// let images = getImages(src)
		let imageSrc = '../../../media/hero.jpg?as=webp1x'
		let __dir = resolve('src')
		// let imageSrc = resolve(__dir, 'media/hero.jpg')

		let imports = []
		let presets = ['1x', 'sm', 'webp1x', 'webpSm']

		if (1 == 1) {
			// import(/* webpackMode: "eager" */ '../../../media/hero.jpg?as=webp1x').then((module) => {})

			presets.forEach(preset => {
				imports.push(
					`\nimport(/* webpackMode: "eager" */ '${imageSrc}?as=${preset}');`
				)
			})
		}

		// let hbsImage = new Handlebars.compile('<img src="' + imageSrc + '" alt="">')({})

		imports = imports.join(' ')

		let output = `<picture ${attributes}>
			<source media="(max-width: 767px)" srcset="${paths.srcsetWebp}">
			<source srcset="${paths.srcsetWebp}" type="image/webp">
			<img src="${paths.initial}" srcset="${paths.srcset}" alt="${altText}">
		</picture>
		<!--${__dir}-->
		<!--${imports}-->`

		return new Handlebars.SafeString(output)
}

// async function getImages(src) {
// 	let images = {}
// 	let is2x = src.match(/@2x/)
// 	let paths = {}

// 	if (is2x) {
// 		paths.initialSm = '../../../media/hero@2x.jpg?as=sm'
// 		paths.initial1x = '../../../media/hero@2x.jpg?as=1x'
// 		paths.initial2x = '../../../media/hero@2x.jpg?as=2x'
// 		paths.webpSm = '../../../media/hero.jpg?as=webpSm'
// 		paths.webp1x = '../../../media/hero.jpg?as=webp1x'
// 		paths.webp2x = '../../../media/hero.jpg?as=webp2x'
// 	} else {
// 		paths.initialSm = '../../../media/hero.jpg?as=sm'
// 		paths.initial1x = '../../../media/hero.jpg?as=1x'
// 		paths.webpSm = '../../../media/hero.jpg?as=webpSm'
// 		paths.webp1x = '../../../media/hero.jpg?as=webp1x'
// 	}

// 	for (let format in paths) {
// 		// images[format] = requireFunc(`${paths[format]}`)
// 	}

// 	return images
// }
