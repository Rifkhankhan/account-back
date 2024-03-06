const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const Schema = mongoose.Schema

mongoose.Promise = global.Promise
const ResultSchema = new Schema(
	{
		teacherId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Teacher'
		},
		examId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Exam'
		},
		subject: {
			type: String,
			required: true
		},
		results: [
			{
				student: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Student',
					required:true
				},
				result:{
					type:String,
					required:true
				}
			}
		]
	},
	{ timestamps: true }
)

module.exports =
	mongoose.models.Result || mongoose.model('Result', ResultSchema)

//how to center a div in css?
