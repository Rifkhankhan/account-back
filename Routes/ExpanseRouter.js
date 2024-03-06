const router = require('express').Router();
const {
	CreateExpanse,
	getExpanses,
	getExpanse,
	updateExpanse,
	deleteExpanse
} = require('../Controllers/ExpanseController');

// add new request
router.post('/', CreateExpanse);

// gets
router.get('/', getExpanses);

// update
router.put('/:id', updateExpanse);

// get product
router.get('/:id', getExpanse);

// delete product
router.delete('/:id', deleteExpanse);

module.exports = router;
