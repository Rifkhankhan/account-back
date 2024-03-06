const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AdvanceSchema = new Schema(
	{
		date: {
			type: Date,
			required: true
		},
		amount: {
			type: Number,
			required: true
		},
		narration: {
			type: String,
			required: true
		},
		category: {
			type: String,
			default: 'advance'
		},
		type: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
)

const AdvanceModel = mongoose.model('Advance', AdvanceSchema)
module.exports = AdvanceModel
