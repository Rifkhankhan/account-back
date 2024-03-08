// const User = require('../Models/Blog');
const AccountRequestModel = require('../Models/AccountRequestModel')
const { v4: uuid } = require('uuid')

exports.CreateRequest = async (req, res, next) => {
	// Assuming you have imported the necessary modules and set up your database connection

	// Assuming AccountRequestModel is your Mongoose model for account requests

	// Sort the records by date in descending order and limit the result to 1

	// to get opp balance for that sort previous date datas and get balance of the last date and put into opp balance

	// console.log(req.body.date.split(' ')[0])

	try {
		// AccountRequestModel.findOne({ date: { $eq: req.body.date } }) // need permission for that and change every requests
		AccountRequestModel.findOne({})

			.sort({ date: -1 }) // Sort by date in accending order
			.exec((err, lastRecord) => {
				if (err) {
					// Handle error
					console.error(err)
					return
				}

				if (
					req.body.requestType === 'receipt' ||
					req.body.requestForm === 'got'
				) {
					if (lastRecord) {
						// Found a last record
						const previousBalance = lastRecord.balance
						const currentAmount = req.body.amount
						const newBalance = +previousBalance + +currentAmount

						const newProduct = new AccountRequestModel({
							date: req.body.date,
							amount: +req.body.amount,
							narration: req.body.narration,
							requestType: req.body.requestType,
							requestForm: req.body.requestForm,
							oppBalance: 0,
							user: req.body?.userId,
							balance: newBalance
						})

						// previuos date records.......................................
						// Function to query for the previous day's record
						const queryPreviousDayRecord = () => {
							try {
								AccountRequestModel.findOne({
									date: { $lt: req.body.date.split(' ')[0] }
								})
									.sort({ date: -1 })
									.exec((err, lastDayRecord) => {
										if (err) {
											console.error(err)
											return
										}

										if (lastDayRecord) {
											newProduct.oppBalance = lastDayRecord.balance
											newProduct.balance =
												+req.body.amount + +lastRecord.balance
										}

										// Save the new product after querying for the previous day's record
										newProduct.save((err, savedProduct) => {
											if (err) {
												console.error(err)
												return
											}
											// Handle successful save
											res.json({ success: true, product: savedProduct })
										})
									})
							} catch (err) {
								console.error(err)
								return
							}
						}

						// Call the function to query for the previous day's record before saving the new product
						queryPreviousDayRecord()
					} else {
						// No previous records found

						const newProduct = new AccountRequestModel({
							date: req.body.date,
							amount: req.body.amount,
							narration: req.body.narration,
							requestType: req.body.requestType,
							requestForm: req.body.requestForm,
							oppBalance: 0,
							user: req.body?.userId,
							balance: +req.body.amount
						})

						// Save the new product
						newProduct.save((err, savedProduct) => {
							if (err) {
								// Handle error
								console.error(err)
								return
							}
							// Handle successful save

							res.json({ success: true, product: newProduct })
						})
					}
				} else {
					if (lastRecord) {
						console.log(lastRecord)
						// Found a last record
						const previousBalance = lastRecord.balance
						const currentAmount = req.body.amount
						const newBalance = +previousBalance - +currentAmount

						const newProduct = new AccountRequestModel({
							date: req.body.date,
							amount: +req.body.amount,
							narration: req.body.narration,
							requestType: req.body.requestType,
							requestForm: req.body.requestForm,
							oppBalance: 0,
							user: req.body?.userId,
							balance: newBalance
						})

						// previuos date records.......................................
						// Function to query for the previous day's record
						const queryPreviousDayRecord = () => {
							try {
								AccountRequestModel.findOne({
									date: { $lt: req.body.date.split(' ')[0] }
								})
									.sort({ date: -1 })
									.exec((err, lastDayRecord) => {
										if (err) {
											console.error(err)
											return
										}

										if (lastDayRecord) {
											newProduct.oppBalance = lastDayRecord.balance
											newProduct.balance = lastRecord.balance - +req.body.amount
										}

										// Save the new product after querying for the previous day's record
										newProduct.save((err, savedProduct) => {
											if (err) {
												console.error(err)
												return
											}
											// Handle successful save
											res.json({ success: true, product: savedProduct })
										})
									})
							} catch (err) {
								console.error(err)
								return
							}
						}

						// Call the function to query for the previous day's record before saving the new product
						queryPreviousDayRecord()
					} else {
						// No previous records found

						const newProduct = new AccountRequestModel({
							date: req.body.date,
							amount: req.body.amount,
							narration: req.body.narration,
							requestType: req.body.requestType,
							requestForm: req.body.requestForm,
							oppBalance: 0,
							user: req.body?.userId,
							balance: -+req.body.amount
						})

						// Save the new product
						newProduct.save((err, savedProduct) => {
							if (err) {
								// Handle error
								console.error(err)
								return
							}
							// Handle successful save

							res.json({ success: true, product: newProduct })
						})
					}
				}
			})
	} catch (err) {
		return next(err)
	}
}

// get all products
exports.getRequests = async (req, res, next) => {
	try {
		const products = await AccountRequestModel.find()
		res.json(products)
	} catch (err) {
		return next(err)
	}
}

// //get all products of a shop
exports.DisableRequest = async (req, res, next) => {
	const { id } = req.params.id
	try {
		const product = await AccountRequestModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true
			}
		)

		res.json(product)
	} catch (err) {
		return next(err)
	}
}

// get product
exports.getRequest = async (req, res, next) => {
	const { id } = req.params.id

	try {
		const expanse = await AccountRequestModel.findById(req.params.id)
		res.json(expanse)
	} catch (err) {
		return next(err)
	}
}

// //get all products of a shop
exports.updateRequest = async (req, res, next) => {
	const { id } = req.params.id
	try {
		const product = await AccountRequestModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true
			}
		)

		res.json(product)
	} catch (err) {
		return next(err)
	}
}

// const queryPreviousDayRecord = () => {
// 	try {
// 		AccountRequestModel.findOne({
// 			date: { $lt: req.body.date.split(' ')[0] }
// 		})
// 			.sort({ date: -1 })
// 			.exec((err, lastDayRecord) => {
// 				if (err) {
// 					console.error(err)
// 					return
// 				}

// 				if (lastDayRecord) {
// 					const previousDate = new Date(lastDayRecord.date)
// 						.toISOString()
// 						.slice(0, 10) // Extracting YYYY-MM-DD part
// 					const givenDate = new Date(req.body.date)
// 						.toISOString()
// 						.slice(0, 10)

// 					if (previousDate !== givenDate) {
// 						console.log('logic: ', date1UTC !== date2UTC)
// 						newProduct.oppBalance = lastDayRecord.balance
// 						newProduct.balance =
// 							+lastDayRecord.balance +
// 							+req.body.amount +
// 							+lastRecord.balance
// 					} else {
// 						newProduct.oppBalance = lastDayRecord.oppBalance
// 						newProduct.balance =
// 							+lastDayRecord.balance + +req.body.amount
// 					}
// 				}

// 				// Save the new product after querying for the previous day's record
// 				newProduct.save((err, savedProduct) => {
// 					if (err) {
// 						console.error(err)
// 						return
// 					}
// 					// Handle successful save
// 					res.json({ success: true, product: newProduct })
// 				})
// 			})
// 	} catch (err) {
// 		console.error(err)
// 		return
// 	}
// }
