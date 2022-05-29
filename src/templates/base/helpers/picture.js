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

		let images = importImages(src)

		let output = `<picture ${attributes}>
			<source media="(max-width: 767px)" srcset="${paths.srcsetWebp}">
			<source srcset="${paths.srcsetWebp}" type="image/webp">
			<img src="${paths.initial}" srcset="${paths.srcset}" alt="${altText}">
		</picture>
		${__dir}`

		return new Handlebars.SafeString(output)
}

function importImages(src) {
	let images = {}
	let is2x = src.match(/@2x/)

	if (is2x) {
		// let initialSm = require('../../../media/hero@2x.jpg?as=small')
		// let initial1x = require('../../../media/hero@2x.jpg?as=1x')
		// let initial2x = require('../../../media/hero@2x.jpg?as=2x')
		// let webpSm = require('../../../media/hero.jpg?as=webpSm')
		// let webp1x = require('../../../media/hero.jpg?as=webp1x')
		// let webp2x = require('../../../media/hero.jpg?as=webp2x')
	} else {
		images.initialSm = require('../../../media/hero.jpg?as=sm')
		// images.initial1x = require('../../../media/hero.jpg?as=1x')
		images.webpSm = require('../../../media/hero.jpg?as=webpSm')
		images.webp1x = require('../../../media/hero.jpg?as=webp1x')
	}

	return images
}
