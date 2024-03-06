const router = require('express').Router()
const {
	CreateProduct,
	getProduct,
	getProducts,
	deleteProduct,
	updateProduct
} = require('../Controllers/ServiceController')

//add new request
router.post('/', CreateProduct)

//gets
router.get('/', getProducts)

// update
router.put('/:id', updateProduct)

//get product
router.get('/:id', getProduct)

//delete product
router.delete('/:id', deleteProduct)

module.exports = router
