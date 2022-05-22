if (module.hot) module.hot.accept()

import '../styles/index.scss'

import './components/Slider'

const elvenShieldRecipe = {
	leatherStrips: 2,
	ironIngot: 1,
	refinedMoonstone: 4
}

const elvenGauntletsRecipe = {
	...elvenShieldRecipe,
	leather: 1,
	refinedMoonstone: 4,
}

console.log(elvenShieldRecipe)
console.log(elvenGauntletsRecipe)
