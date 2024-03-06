const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const Schema = mongoose.Schema

mongoose.Promise = global.Promise
const ShopSchema = new Schema(
	{
		name: {
			type: String,
			require: true
		},
		owner: {
			type: String,
			require: true
		},
		phone: {
			type: String,
			require: false
		},
		village: {
			type: String,
			required: true
		},
		rank: {
			type: Number,
			required: true,
			default: 3
		},

		photos: {
			type: Array,
			required: false
		},
		image: {
			type: String
		},

		questions: {
			type: Array,
			required: false
		},

		status: {
			type: Boolean,
			default: true
		},
		points: {
			type: Number,
			default: 0
		},
		profilePicture: String
	},
	{ timestamps: true }
)

module.exports = mongoose.models.Shop || mongoose.model('Shop', ShopSchema)

//how to center a div in css?
