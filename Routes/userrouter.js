const router = require('express').Router();
const {
	usersignin,

	uploadProfilePhoto,
	// adminSignIn,
	updateUser,
	getUserData,

	createCustomer,
	getCustomers,
	updateCustomer
} = require('../Controllers/usercontroller.js');

// get user
router.post('/', createCustomer);
router.get('/', getCustomers);
router.put('/:id', updateCustomer);

// get user by token

// user sign in
router.post('/signin', usersignin);

// upload profile image

// user update profile
// router.put('/:id', updateUser);

// // forgot password
// router.post("/forgot-password", forgotPassword)
// router.put('/reset-password/:resetPasswordToken', resetPassword);

module.exports = router;
