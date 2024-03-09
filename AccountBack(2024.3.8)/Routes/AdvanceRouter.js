const router = require('express').Router()
const {
	CreateAdvance,
	getAdvances,
	updateAdvance,
	getAdvance,
	deleteAdvance
} = require('../Controllers/AdvanceController')

// add new request
router.post('/', CreateAdvance)

// gets
router.get('/', getAdvances)

// update
router.put('/:id', updateAdvance)

// get product
router.get('/:id', getAdvance)

// delete product
router.delete('/:id', deleteAdvance)

module.exports = router
