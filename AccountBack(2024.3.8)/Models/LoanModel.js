const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LoanSchema = new Schema(
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
			default: 'loan'
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

const LoanModel = mongoose.model('Loan', LoanSchema)
module.exports = LoanModel
