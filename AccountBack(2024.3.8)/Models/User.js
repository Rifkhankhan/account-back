const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const Schema = mongoose.Schema

mongoose.Promise = global.Promise
const UserSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
			unique: true
		},
		smartAccountId: String,

		phone: {
			type: String,
			required: false
		},

		password: {
			type: String,
			required: true,
			minlength: 8,
			// select set to false so password doesn't come when querying automatically
			select: false
		},
		expansePermission: {
			type: String,
			default: 'no'
		},

		expanseEditPermission: {
			type: String,
			default: 'no'
		},
		expanseDeletePermission: {
			type: String,
			default: 'no'
		},
		receiptPermission: {
			type: String,
			default: 'no'
		},
		receiptEditPermission: {
			type: String,
			default: 'no'
		},
		receiptDeletePermission: {
			type: String,
			default: 'no'
		},
		status: {
			type: Boolean,
			default: true
		},
		profilePoints: {
			type: Number,
			default: 0
		},

		isAdmin: {
			type: Boolean,
			default: false
		},
		profilePicture: String,

		address: String,

		gender: String,
		resetPasswordToken: String,
		resetPasswordExpire: Date,

		authToken: String
	},
	{ timestamps: true }
)

// this function run before saving data to database
UserSchema.pre('save', async function (next) {
	// hashing the password
	// checking if the password is already hashed
	if (!this.isModified('password')) {
		next()
	}

	// hashing the with difficulty level 12
	this.password = await bcrypt.hash(this.password, 12)
	next()
})

// reset password token
UserSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex')

	// Hash token (private key) and save to database
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')

	// Set token expire date
	this.resetPasswordExpire = Date.now() + 10 * (60 * 1000) // Ten Minutes

	return resetToken
}

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)

// how to center a div in css?
