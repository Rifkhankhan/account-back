const router = require('express').Router()
const {
	CreateRequest,
	getRequest,
	getRequests,
	DisableRequest,
	updateRequest
} = require('../Controllers/AccountRequestController')

// add new request
router.post('/', CreateRequest)

// gets
router.get('/', getRequests)

// update
router.put('/:id', updateRequest)

// get product
router.get('/:id', getRequest)

// delete product
router.delete('/:id', DisableRequest)

module.exports = router
