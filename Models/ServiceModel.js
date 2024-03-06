const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ServiceSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		available: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true
	}
)

const ServiceModel = mongoose.model('Service', ServiceSchema)
module.exports = ServiceModel
