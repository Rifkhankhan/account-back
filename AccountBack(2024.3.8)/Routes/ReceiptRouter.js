const router = require('express').Router();
const {
	CreateReceipt,
	deleteReceipt,
	getReceipt,
	getReceipts,
	updateReceipt
} = require('../Controllers/ReceiptController');

// add new request
router.post('/', CreateReceipt);

// gets
router.get('/', getReceipts);

// update
router.put('/:id', updateReceipt);

// get product
router.get('/:id', getReceipt);

// delete product
router.delete('/:id', deleteReceipt);

module.exports = router;
