const MovieModel = require('../Models/MovieModel')
const CategoryModel = require('../Models/CategoryModel')
const fs = require('fs')
const path = require('path')
const NetflixUsers = require('../Models/NetflixUsers')

exports.CreateItem = async (req, res, next) => {
	const url = req.protocol + '://' + req.get('host')
	console.log(req.body)

	console.log(req.file.filename)
	const newItem = new MovieModel({
		name: req.body.name,
		category: req.body.category,
		year: req.body.year,
		desc: req.body.desc,
		type: req.body.type,
		image: url + '/uploads/' + req.file.filename
	})

	try {
		await newItem.save()
	} catch (err) {
		return next(err)
	}
	res.json(newItem)
}

exports.getItems = async (req, res, next) => {
	try {
		const movies = await MovieModel.find()
		res.json(movies)
	} catch (err) {
		return next(err)
	}
}

exports.getItem = async (req, res, next) => {
	const { id } = req.params
	try {
		const movie = await MovieModel.find({ _id: id })
		res.json(movie)
	} catch (err) {
		return next(err)
	}
}
exports.deleteItem = async (req, res, next) => {
	const { id } = req.params
	try {
		const movie = await MovieModel.find({ _id: id })
		res.json(movie)
	} catch (err) {
		return next(err)
	}
}

exports.updateItem = async (req, res, next) => {
	const { id } = req.params
	const url = req.protocol + '://' + req.get('host')
	try {
		let data = req.body
		const item = await MovieModel.findById(req.params.id)
		if (item.image !== req.body.image) {
			data.image = url + '/uploads/' + req.file.filename
		}
		const userData = await MovieModel.findByIdAndUpdate(req.params.id, data, {
			new: true
		})
		// const filePath = path.join(__dirname, req.body.image);
		// fs.unlink(filePath,err => console.log(err))

		res.json(userData)
	} catch (err) {
		return next(err)
	}
}

exports.CreateCategory = async (req, res, next) => {
	const newItem = new CategoryModel({
		name: req.body.name
	})

	try {
		await newItem.save()
	} catch (err) {
		return next(err)
	}
	res.json(newItem)
}
exports.deleteCategory = async (req, res, next) => {
	const { id } = req.params

	try {
		const cate = await CategoryModel.findById(id)
		await cate.remove()
		res.json(cate)
	} catch (err) {
		return next(err)
	}
}
exports.getCategories = async (req, res, next) => {
	try {
		const categories = await CategoryModel.find()
		res.json(categories)
	} catch (err) {
		return next(err)
	}
}

//like
exports.likeItem = async (req, res) => {
	const { id, userId } = req.body
	console.log(req.body)

	try {
		const product = await MovieModel.findById(id)
		if (!product.likes.includes(userId)) {
			await product.updateOne({ $push: { likes: userId } })
			if (product.dislikes.includes(userId)) {
				await product.updateOne({ $pull: { dislikes: userId } })
			}
			res.status(200).json({ product: product })
		}
	} catch (error) {
		res.status(500).json({ status: 'Error with Like', error: error.message })
	}
}

// dislike
exports.dislikeItem = async (req, res) => {
	const { id, userId } = req.body
	console.log('dislike')
	try {
		const product = await MovieModel.findById(id)

		if (!product.dislikes.includes(userId)) {
			await product.updateOne({ $push: { dislikes: userId } })

			if (product.likes.includes(userId)) {
				await product.updateOne({ $pull: { likes: userId } })
			}
			res.status(200).json({ product: product })
		}
	} catch (error) {
		res.status(500).json({ status: 'Error with Like', error: error.message })
	}
}

//saveItem
exports.saveItem = async (req, res) => {
	const { id, userId } = req.body

	try {
		const product = await MovieModel.findById(id)
		if (!product.save.includes(userId)) {
			console.log('saved')

			await product.updateOne({ $push: { save: userId } })
			res.status(200).json({ status: 'Product Saved' })
		} else {
			console.log('deleted')

			await product.updateOne({ $pull: { save: userId } })
			res.status(200).json({ status: 'Product unSaved' })
		}
	} catch (error) {
		res.status(500).json({ status: 'Error with save', error: error.message })
	}
}

//saveItem
exports.downloadItem = async (req, res) => {
	const { id, userId } = req.body

	try {
		const product = await MovieModel.findById(id)
		if (!product.downloads.includes(userId)) {
			console.log('downloaded')

			await product.updateOne({ $push: { downloads: userId } })
			res.status(200).json({ status: 'Product downloaded' })
		} else {
			console.log('deleted')
			await product.updateOne({ $pull: { downloads: userId } })
			res.status(200).json({ status: 'Product Deleted' })
		}
	} catch (error) {
		res.status(500).json({ status: 'Error with save', error: error.message })
	}
}
