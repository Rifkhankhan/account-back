const router = require('express').Router()
const {
	CreateShop,
	getShops,
	getShop,
	deleteShop,
	updateShop
} = require('../Controllers/ShopController.js')

//add new request
router.post('/', CreateShop)
router.get('/', getShops)
router.get('/:id', getShop)
router.put('/:id', updateShop)
router.delete('/:id', deleteShop)

module.exports = router
