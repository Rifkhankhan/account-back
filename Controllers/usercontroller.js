const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Return "https" URLs by setting secure: true

const UserModel = require('../Models/User');
// const sendEmail = require('../utils/sendEmail');
// const uuid = require('uuid');
// const ProductModel = require('../Models/ProductModel');

// get user Data
exports.getUserData = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', err: err.message });
  }
};

// get user Data using token
exports.getAuthData = async (req, res, next) => {
  console.log(req.params.token);
  try {
    const user = await UserModel.find({ authToken: req.params.token });
    console.log(user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', err: err.message });
  }
};
exports.increaseCardCount = async (req, res, next) => {
  const { uid, pid } = req.params;

  try {
    const user = await UserModel.findById(uid);
    const cardItem = user.card.find(product => product._id.toString() === pid);
    cardItem.count++;
    user.card = user.card.filter(pro => pro._id.toString() !== pid);
    user.card.push(cardItem);
    user.card.reverse();
    await user.save();
    res.json({
      mesg: 'Successfully increased item into your card!',
      card: user.card
    });
  } catch (error) {
    res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message });
  }
};

exports.decreaseCardCount = async (req, res, next) => {
  const { uid, pid } = req.params;

  try {
    const user = await UserModel.findById(uid);
    const cardItem = user.card.find(product => product._id.toString() === pid);
    if (cardItem.count > 1) {
      cardItem.count--;

      user.card = user.card.filter(pro => pro._id.toString() !== pid);
      user.card.push(cardItem);

      await user.save();
      res.json({
        mesg: 'Successfully increased item into your card!',
        card: user.card
      });
    } else {
      user.card = user.card.filter(pro => pro._id.toString() !== pid);
      await user.save();
      res.json({
        mesg: 'Successfully increased item into your card!',
        card: user.card
      });
    }
  } catch (error) {
    res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message });
  }
};

exports.addToCard = async (req, res, next) => {
  const { pid } = req.params;
  const { uid } = req.params;

  try {
    const user = await UserModel.findById(uid);
		// console.log(user.card);
    for (card of user.card) {
      if (card._id.toString() === pid) {
        res.json({ mesg: 'Item is already added!' });
        return;
      }
    }

    let product = await ProductModel.findById(pid);
    product = { ...product._doc, count: 1 };
    user.card.push(product);
    await user.save();
    console.log(user.card);
    res.json({ mesg: 'Successfully Added into your card!', card: user });
  } catch (error) {
    res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message });
  }
};
// user sign in controller
exports.usersignin = async (req, res) => {
  const { name, password } = req.body;

	// Check if email and password is provided
  if (!name || !password) {
    return res
			.status(400)
			.json({ message: 'Please provide an email and password' });
  }

  try {
		// finding user by email
    const user = await UserModel.findOne({ name }).select('+password');

		// if user doesn't exist
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

		// compare the provided password with the password in the database
    const ispasswordCorrect = await bcrypt.compare(password, user.password);

		// if passwords don't match
    if (!ispasswordCorrect) {
      return res.status(409).json({ message: 'Invalid credentials' });
    }

    if (user.status === false) {
      return res.status(408).json({ message: 'User access denied!' });
    }

		// creating a token
    const secretKey = '9892c70a8da9ad71f1829ad03c115408';
    const token = jwt.sign(
			{ name: user.name, id: user._id, secretKey: secretKey },
			secretKey,
			{ expiresIn: '1h' }
		);

		// sending the user object and token as the response
    res.status(200).json({ success: true, token, user: user });
  } catch (error) {
    res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message });
  }
};

exports.autoLogin = async (req, res) => {
  const token = req.body.token;
  const cleanToken = token.replace(/^"(.*)"$/, '$1');

  const secretKey = '9892c70a8da9ad71f1829ad03c115408';
	// verify and decode the token
  let userId;
  jwt.verify(cleanToken, secretKey, (err, decode) => {
    if (err) {
      console.log('Error verifying token', err.message);
    } else {
      console.log(decode);
      userId = decode.id;
    }
  });

  try {
		// finding user by email
    const user = await UserModel.findById(userId);

		// if user doesn't exist
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

		// creating a token
    const token = jwt.sign(
			{ name: user.name, id: user._id },
			'9892c70a8da9ad71f1829ad03c115408',
			{ expiresIn: '1h' }
		);

		// sending the user object and token as the response
    res.status(200).json({ success: true, token, user: user });
  } catch (error) {
    res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message });
  }
};

// user sign up controller
exports.usersignup = async (req, res) => {
  const { name, password } = req.body;

  let users;
  try {
    users = await UserModel.find();
  } catch (err) {
    return next(err);
  }

  let UserId = 'RifkhanApplicationId' + users.length;

  try {
		// checking email already exists
    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) {
      return res
				.status(409)
				.json({ message: 'User with this email already exists' });
    }

		// creating a new user
    const user = await UserModel.create({
      name,
      email,
      password,
      homeDeliveryUserId: UserId
    });

		// creating a token

    const token = jwt.sign(
			{ email: user.email, id: user._id },
			'9892c70a8da9ad71f1829ad03c115408',
			{ expiresIn: '1h' }
		);

		// sending the user object and token as the response
    res.status(200).json({ success: true, result: user, token });
  } catch (error) {
    res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message });
  }
};

// user sign up controller
exports.createCustomer = async (req, res) => {
  let users;
  try {
    users = await UserModel.find();
  } catch (err) {
    return next(err);
  }

  let UserId = 'Smart' + users.length;

  try {
		// checking user already exists
    const userExist = await UserModel.findOne({ name: req.body.name });

    if (userExist) {
      return res.status(409).json({ message: 'User already exists now' });
    }

		// creating a new user
    const user = await UserModel.create({
      name: req.body.name,
      password: '12345678',
      smartId: UserId,
      expansePermission: req.body.expansePermission,
      expanseEditPermission: req.body.expanseEditPermission,
      expanseDeletePermission: req.body.expanseDeletePermission,
      receiptPermission: req.body.expansePermission,
      receiptEditPermission: req.body.receiptEditPermission,
      receiptDeletePermission: req.body.receiptDeletePermission
    });

		// sending the user object and token as the response
    res.status(200).json({ success: true });
  } catch (error) {
    res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message });
  }
};

// user sign up controller
exports.getCustomers = async (req, res) => {
  let users;
  try {
    users = await UserModel.find();
    res.status(200).json(users);
  } catch (err) {
    res
			.status(500)
			.json({ message: 'Something went wrong', error: err.message });
  }

  let UserId = 'Smart' + users.length;
};

// get all products of a shop
exports.updateCustomer = async (req, res, next) => {
  console.log(req.body);
  try {
    const product = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

exports.resetUserPassword = async (req, res, next) => {
  try {
    const data = { ...req.body, password: '12345678' };
    const product = await UserModel.findByIdAndUpdate(req.params.id, data, {
      new: true
    });

    res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};
// update user controller
exports.updateUser = async (req, res) => {
  let userID = req.params.id;

  try {
    let data = req.body;
    const user = await UserModel.findById(userID);
    console.log(req.body.password.length);
    if (req.body.password.length > 20) {
      console.log('not changed');
			// find user by userID and update the user with provided data
      const userData = await UserModel.findByIdAndUpdate(userID, data, {
        new: true
      });

			// update token
      const token = jwt.sign(
				{ email: userData.email, id: userData._id },
				'9892c70a8da9ad71f1829ad03c115408',
				{ expiresIn: '1h' }
			);

			// sending the status message successful
      res.status(200).json({
        success: true,
        result: userData,
        token
      });
    } else {
      console.log('changed');
      data.password = await bcrypt.hash(req.body.password, 12);

			// find user by userID and update the user with provided data
      const userData = await UserModel.findByIdAndUpdate(userID, data, {
        new: true
      });

      data.password = await bcrypt.hash(req.body.password, 12);
			// update token
      const token = jwt.sign(
				{ email: userData.email, id: userData._id },
				'9892c70a8da9ad71f1829ad03c115408',
				{ expiresIn: '1h' }
			);

			// sending the status message successful
      res.status(200).json({
        success: true,
        result: userData,
        token
      });
    }

		// encrypted password
		// $2b$12$V8GXUv2UDNlBNW5LLMzeLeQyyKjfHD6jHdEh5y3mNx9n7g32aHR2a
  } catch (error) {
    res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message });
  }
};

// Activation function
exports.Activation = async (req, res, next) => {
  let userID = req.params.id;

  let user;

  try {
    user = await User.findById(userID);
  } catch (err) {
    return next(err);
  }

  user.status = !user.status;

  try {
    await user.save();
  } catch (err) {
    return next(err);
  }

  res.json(user);
};

// delete user controller
exports.deleteUser = async (req, res) => {
  const userID = req.params.id;

  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === userID || currentUserAdminStatus) {
    try {
			// find user by userID and delete it
      await User.findByIdAndDelete(userID);

			// sending the status message successful
      res.status(200).json({ success: true, message: 'User deleted!' });
    } catch (error) {
      res
				.status(500)
				.json({ message: 'Something went wrong', error: error.message });
    }
  } else {
    res.status(403).json('Access Denied! You can delete own profile!');
  }
};

// fetch users controller
// exports.fetchAll = async (req, res) => {
// 	//calling User model
// 	User.find()
// 		.then((user) => {
// 			res.status(200).json(
// 				user.sort((a, b) => {
// 					return b.createdAt - a.createdAt;
// 				})
// 			);
// 		})
// 		.catch((error) => {
// 			res
// 				.status(500)
// 				.json({ message: 'Error with fetching users', error: error.message });
// 		});
// };

// fetch one user controller
// exports.fetchOne = async (req, res) => {
// 	let userId = req.params.id;
// 	let user = await User.findById(userId);
// 	try {
// 		if (user) {
// 			const { password, ...otherDetails } = user._doc;

// 			res.status(200).json({ success: true, result: otherDetails });
// 		} else {
// 			res.status(404).json('No such a user!');
// 		}
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: 'Something went wrong',
// 			error: error.message
// 		});
// 	}
// };

// Follow a user
// exports.followUser = async (req, res) => {
// 	const userId = req.params.id;

// 	const { _id } = req.body;

// 	if (_id === userId) {
// 		res.status(200).json({ success: true, message: 'Action Denied!' });
// 	} else {
// 		try {
// 			const followUser = await User.findById(userId);
// 			const followingUser = await User.findById(_id);
// 			const status = 'pending';

// 			if (!followUser.followers.includes(_id)) {
// 				await followUser.updateOne({ $push: { following: { _id, status } } });
// 				await followingUser.updateOne({
// 					$push: { followers: { userId, status } }
// 				});
// 				res.status(200).json({ success: true, message: 'User Followed!' });
// 			} else {
// 				res.status(403).json('User is already followed by you!');
// 			}
// 		} catch (error) {
// 			res.status(500).json({
// 				success: false,
// 				message: 'Something went wrong',
// 				error: error.message
// 			});
// 		}
// 	}
// };

// user accept
// exports.userAcceptance = async (req, res, next) => {
// 	const userId = req.params.id;

// 	const { _id } = req.body;

// 	if (_id === userId) {
// 		res.status(200).json({ success: true, message: 'Action Denied!' });
// 	} else {
// 		try {
// 			const user = await User.findById(userId);
// 			const followingUser = await User.findById(_id);

// 			if (!user.followers.includes(_id)) {
// 				await user.updateOne({ $push: { followers: _id } });
// 				await followingUser.updateOne({ $push: { following: userId } });
// 				await user.updateOne({ $pull: { followRequests: _id } });
// 				await followingUser.updateOne({ $pull: { myRequests: userId } });
// 				res.status(200).json({ success: true, message: 'User Followed!' });
// 			} else {
// 				res.status(403).json('User is already Followed by you!');
// 			}
// 		} catch (error) {
// 			res.status(500).json({
// 				success: false,
// 				message: 'Something went wrong',
// 				error: error.message
// 			});
// 		}
// 	}
// };

// user reject
// exports.userRejectRequest = async (req, res, next) => {
// 	const userId = req.params.id;

// 	const { _id } = req.body;

// 	if (_id === userId) {
// 		res.status(200).json({ success: true, message: 'Action Denied!' });
// 	} else {
// 		try {
// 			const user = await User.findById(userId);
// 			const followingUser = await User.findById(_id);

// 			if (user.followRequests.includes(_id)) {
// 				await user.updateOne({ $pull: { followRequests: _id } });
// 				await followingUser.updateOne({ $pull: { myRequests: userId } });
// 				res.status(200).json({ success: true, message: 'User Rejected!' });
// 			} else {
// 				res.status(403).json('User is already Rejected by you!');
// 			}
// 		} catch (error) {
// 			res.status(500).json({
// 				success: false,
// 				message: 'Something went wrong',
// 				error: error.message
// 			});
// 		}
// 	}
// };

// user request
// exports.userRequest = async (req, res) => {
// 	const userId = req.params.id;

// 	const { _id } = req.body;

// 	if (_id === userId) {
// 		res.status(200).json({ success: true, message: 'Action Denied!' });
// 	} else {
// 		try {
// 			const user = await User.findById(userId);
// 			const followingUser = await User.findById(_id);

// 			if (!user.myRequests.includes(_id)) {
// 				await user.updateOne({ $push: { myRequests: _id } });
// 				await followingUser.updateOne({ $push: { followRequests: userId } });
// 				res.status(200).json({ success: true, message: 'User Request!' });
// 			} else {
// 				res.status(403).json('User is already Request by you!');
// 			}
// 		} catch (error) {
// 			res.status(500).json({
// 				success: false,
// 				message: 'Something went wrong',
// 				error: error.message
// 			});
// 		}
// 	}
// };

// delete request
// exports.userDisableFollower = async (req, res, next) => {
// 	const userId = req.params.id;

// 	const { _id } = req.body;

// 	if (_id === userId) {
// 		res.status(200).json({ success: true, message: 'Action Denied!' });
// 	} else {
// 		try {
// 			const user = await User.findById(userId);
// 			const followingUser = await User.findById(_id);

// 			if (!user.followers.includes(_id)) {
// 				await user.updateOne({ $push: { followers: { _id, status: false } } });
// 				res.status(200).json({ success: true, message: 'User Request!' });
// 			} else {
// 				res.status(403).json('User is already Request by you!');
// 			}
// 		} catch (error) {
// 			res.status(500).json({
// 				success: false,
// 				message: 'Something went wrong',
// 				error: error.message
// 			});
// 		}
// 	}
// };

// UnFollow a user
// exports.unFollowUser = async (req, res) => {
// 	const userId = req.params.id;

// 	const { _id } = req.body;

// 	if (_id === userId) {
// 		res.status(200).json({ success: true, message: 'Action Denied!' });
// 	} else {
// 		try {
// 			const followUser = await User.findById(userId);
// 			const followingUser = await User.findById(_id);

// 			if (followUser.followers.includes(_id)) {
// 				await followUser.updateOne({ $pull: { followers: _id } });
// 				await followingUser.updateOne({ $pull: { following: userId } });
// 				res.status(200).json({ success: true, message: 'User Unfollowed!' });
// 			} else {
// 				res.status(403).json('User is not followed by you!');
// 			}
// 		} catch (error) {
// 			res.status(500).json({
// 				success: false,
// 				message: 'Something went wrong',
// 				error: error.message
// 			});
// 		}
// 	}
// };

// get All users
// exports.getUsers = async (req, res) => {
// 	try {
// 		let users = await User.find();
// 		users = users.map((user) => {
// 			const { password, ...otherDetails } = user._doc;
// 			return otherDetails;
// 		});
// 		res.status(200).json(
// 			users.sort((a, b) => {
// 				return b.createdAt - a.createdAt;
// 			})
// 		);
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: 'Something went wrong',
// 			error: error.message
// 		});
// 	}
// };

// update password
// exports.updatePassword = async (req, res, next) => {
// 	const userId = req.params.id;
// 	const { newPassword, oldPassword } = req.body;

// 	const user = await User.findById(userId).select('+password');
// 	const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

// 	try {
// 		if (isPasswordCorrect) {
// 			user.password = newPassword;

// 			// update token
// 			const token = jwt.sign(
// 				{ email: user.email, id: user._id },
// 				process.env.JWT_SECRET,
// 				{ expiresIn: '1h' }
// 			);

// 			await user.save();
// 			res.status(200).json({
// 				message: 'Password updated Successfully',
// 				UpdatedPassword: user.password,
// 				oldPassword,
// 				newPassword
// 			});
// 		} else {
// 			res.status(400).json({ message: 'password is not correct!' });
// 		}
// 	} catch (err) {
// 		return next(err);
// 	}
// };

// get requests
// exports.getRequests = async (req, res) => {
// 	let userId = req.params.id;
// 	let user = await User.findById(userId);
// 	try {
// 		if (user) {
// 			const { password, ...otherDetails } = user._doc;

// 			res
// 				.status(200)
// 				.json({ success: true, list: otherDetails.followRequests });
// 		} else {
// 			res.status(404).json('No such a user!');
// 		}
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: 'Something went wrong',
// 			error: error.message
// 		});
// 	}
// };

// education

// exports.createEducation = async (req, res, next) => {
// 	const { id } = req.params;

// 	let user;

// 	try {
// 		user = await User.findById(id);
// 	} catch (err) {
// 		return next(err);
// 	}

// 	const newEducation = {
// 		id: uuid.v1(),
// 		name: req.body.name,
// 		desc: req.body.desc,
// 		image: req.body.image,
// 		year: req.body.year
// 	};

// 	user.education.push(newEducation);

// 	try {
// 		await user.save();
// 	} catch (err) {
// 		return next(err);
// 	}
// 	res.json(user);
// };

// exports.getEducations = async (req, res, next) => {
// 	const { id } = req.params;

// 	let user;

// 	try {
// 		user = await User.findById(id);
// 	} catch (err) {
// 		return next(err);
// 	}

// 	res.status(200).json(user.education);
// };

// exports.getEducation = async (req, res, next) => {
// 	const { id, eid } = req.params;

// 	let user;
// 	let education;

// 	try {
// 		user = await User.findById(id);
// 	} catch (err) {
// 		return next(err);
// 	}

// 	education = user.education.find((e) => e.id === eid);

// 	res.status(200).json(education);
// };

// exports.updateEducation = async (req, res, next) => {
// 	const { id, eid } = req.params;

// 	let user;

// 	try {
// 		user = await User.findById(id);
// 	} catch (err) {
// 		return next(err);
// 	}

// 	const newEducation = {
// 		id: eid,
// 		name: req.body.name,
// 		desc: req.body.desc,
// 		image: req.body.image,
// 		year: req.body.year
// 	};

// 	try {
// 		await user.updateOne({ $pull: { education: { id: eid } } });
// 		await user.updateOne({ $push: { education: newEducation } });
// 		res.status(200).json({ success: true, message: 'updated' });
// 	} catch (err) {
// 		return next(err);
// 	}
// };

// exports.deleteEducation = async (req, res, next) => {
// 	const { id, eid } = req.params;

// 	let user;

// 	try {
// 		user = await User.findById(id);
// 	} catch (err) {
// 		return next(err);
// 	}

// 	try {
// 		await user.updateOne({ $pull: { education: { id: eid } } });
// 		res.status(200).json({ success: true, message: 'deleted' });
// 	} catch (err) {
// 		return next(err);
// 	}
// };

// invite new friend
// exports.inviteNewFriend = async (req, res) => {
// 	const { email } = req.body;
// 	const { userEmail } = req.body;

// 	try {
// 		//finding user by userEmail
// 		const user = await User.findOne({ userEmail });

// 		//if user doesn't exist
// 		if (!user)
// 			return res.status(404).json({ message: "You don't have an account!" });

// 		// HTML Message
// 		const message = `
//             <h1>Your friend ${user.firstname} ${user.lastname} invited to WEBH!</h1>
//             <p>Please click on this link to get register to the WebH!</p>
//             <a href="http://44.202.187.100:3000/auth" clicktracking=off>Click here</a>
//         `;

// 		try {
// 			//sending the the email
// 			await sendEmail({
// 				to: email,
// 				subject: 'Invite Request from WEBH!',
// 				text: message
// 			});
// 			res.status(200).json({ success: true, data: 'Email Sent' });
// 		} catch (error) {
// 			res
// 				.status(500)
// 				.json({ message: 'Email could not be sent', error: error.message });
// 		}
// 	} catch (error) {
// 		res
// 			.status(500)
// 			.json({ message: 'Something went wrong', error: error.message });
// 	}
// };
