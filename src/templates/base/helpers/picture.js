const { resolve } = require('path')
const Handlebars  = require('handlebars')

const __dir = resolve('src/media')

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

		let images = getImages(src)
		// let images = require('../../../media/hero.jpg?as=webp1x')

		let output = `<picture ${attributes}>
			<source media="(max-width: 767px)" srcset="${paths.srcsetWebp}">
			<source srcset="${paths.srcsetWebp}" type="image/webp">
			<img src="${paths.initial}" srcset="${paths.srcset}" alt="${altText}">
		</picture>
		${__dir}`

		return new Handlebars.SafeString(output)
}

async function getImages(src) {
	let images = {}
	let is2x = src.match(/@2x/)
	let paths = {}

	if (is2x) {
		paths.initialSm = '../../../media/hero@2x.jpg?as=small'
		paths.initial1x = '../../../media/hero@2x.jpg?as=1x'
		paths.initial2x = '../../../media/hero@2x.jpg?as=2x'
		paths.webpSm = '../../../media/hero.jpg?as=webpSm'
		paths.webp1x = '../../../media/hero.jpg?as=webp1x'
		paths.webp2x = '../../../media/hero.jpg?as=webp2x'
	} else {
		paths.initialSm = '../../../media/hero.jpg?as=sm'
		paths.initial1x = '../../../media/hero.jpg?as=1x'
		paths.webpSm = '../../../media/hero.jpg?as=webpSm'
		paths.webp1x = '../../../media/hero.jpg?as=webp1x'
	}

	for (let format in paths) {
		images[format] = require(paths[format])
	}

	// paths.webp1x = require('../../../media/hero.jpg?as=webp1x')
	// paths.initial2x = require('../../../media/articles/item.jpg?as=1x')

	return images
}
