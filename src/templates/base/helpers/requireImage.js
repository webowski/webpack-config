// let image = require('../../../media/hero.jpg?format=webp')
// import image from'../../../media/hero.jpg?format=webp'

const requireImage = (src) => {
	return import(src)
}

export default requireImage
