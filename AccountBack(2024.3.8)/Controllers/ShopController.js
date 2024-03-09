const ShopModel = require('../Models/ShopModel')

exports.CreateShop = async (req, res, next) => {
	// name,price
	const newShop = new ShopModel({
		name: req.body.name,
		owner: req.body.owner,
		phone: req.body.phone,
		address: req.body.address,
		village: req.body.village,
		image: req.body?.image
	})

	try {
		await newShop.save()
	} catch (err) {
		return next(err)
	}
	res.json(newShop)
}

exports.getShops = async (req, res, next) => {
	try {
		const shops = await ShopModel.find()
		res.json(shops)
	} catch (err) {
		return next(err)
	}
}

exports.getShop = async (req, res, next) => {
	const { id } = req.params
	try {
		const shop = await ShopModel.find({ _id: id })
		res.json(shop)
	} catch (err) {
		return next(err)
	}
}

//get all products of a shop
exports.updateShop = async (req, res, next) => {
	console.log(req.body)
	try {
		const product = await ShopModel.findByIdAndUpdate(req.params.id, req.body, {
			new: true
		})

		res.json({ shop: product })
	} catch (err) {
		return next(err)
	}
}

//get all products of a shop
exports.deleteShop = async (req, res, next) => {
	const { id } = req.params.id

	try {
		const product = await ShopModel.findByIdAndDelete(req.params.id)
		res.json({ message: 'Successfully deleted' })
	} catch (err) {
		return next(err)
	}
}
