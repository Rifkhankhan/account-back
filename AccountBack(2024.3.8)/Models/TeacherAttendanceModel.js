const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const Schema = mongoose.Schema

mongoose.Promise = global.Promise
const TeacherAttendanceModel = new Schema(
	{
		date: {
			type: Date,
			required: true,
			default: Date.now
		},
		teachers: [{
			type: mongoose.Schema.Types.ObjectId,

			ref: 'Student',
			required: true
		}]
	},
	{ timestamps: true }
)

module.exports =
	mongoose.models.TeacherAttendance ||
	mongoose.model('TeacherAttendance', TeacherAttendanceModel)

//how to center a div in css?
