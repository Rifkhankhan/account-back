const router = require('express').Router()
const {
	CreateLoan,
	getLoans,
	updateLoan,
	getLoan,
	deleteLoan
} = require('../Controllers/LoanController')

// add new request
router.post('/', CreateLoan)

// gets
router.get('/', getLoans)

// update
router.put('/:id', updateLoan)

// get product
router.get('/:id', getLoan)

// delete product
router.delete('/:id', deleteLoan)

module.exports = router
