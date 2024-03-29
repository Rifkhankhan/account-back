const router = require('express').Router()
const {
	CreateRequest,
	getRequest,
	getRequests,
	updateRequest,
	ToggleRequest
} = require('../Controllers/AccountRequestController')

// add new request
router.post('/', CreateRequest)

// gets
router.get('/', getRequests)

// update
router.put('/:id', updateRequest)

// ToggleDisable
router.put('/disable/:id', ToggleRequest)

// get product
router.get('/:id', getRequest)

module.exports = router
