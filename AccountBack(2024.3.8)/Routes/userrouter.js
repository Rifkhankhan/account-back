const router = require('express').Router()
const {
	usersignin,

	uploadProfilePhoto,
	// adminSignIn,
	updateUser,
	getUserData,

	createCustomer,
	getCustomers,
	updateCustomer,
	autoLogin,
	Activation
} = require('../Controllers/usercontroller.js')

// get user
router.post('/createUser', createCustomer)
router.post('/autoLogin/:token', autoLogin)
router.post('/signin', usersignin)
router.get('/', getCustomers)
router.put('/:id', updateCustomer)
router.put('/:id', updateCustomer)

// get user by token

// user sign in
router.put('/activate/:id', Activation)

// upload profile image

// user update profile
// router.put('/:id', updateUser);

// // forgot password
// router.post("/forgot-password", forgotPassword)
// router.put('/reset-password/:resetPasswordToken', resetPassword);

module.exports = router
