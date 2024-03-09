// const User = require('../Models/Blog');
const Advance = require('../Models/AdvanceModel')
const { v4: uuid } = require('uuid')

exports.CreateAdvance = async (req, res, next) => {
	const newProduct = new Advance({
		date: req.body.date,
		amount: req.body.amount,
		narration: req.body.narration,
		type: req.body.type
	})

	try {
		await newProduct.save()
	} catch (err) {
		return next(err)
	}

	res.json(newProduct)
}

// get all products
exports.getAdvances = async (req, res, next) => {
	try {
		const Advances = await Advance.find()
		res.json(Advances)
	} catch (err) {
		return next(err)
	}
}

// //get all products of a shop
// exports.getShopProducts = async (req, res, next) => {
// 	const {id} = req.params.id

// 	try {
// 		const products = await ProductModel.find({shopId:req.params.id});
// 		res.json(products);
// 	} catch (err) {
// 		return next(err);
// 	}
// };

// //get all products of a shop
// exports.getProductsByType = async (req, res, next) => {
// 	const {type} = req.params.type

// 	try {
// 		const products = await ProductModel.find({category:req.params.type});
// 		res.json(products);
// 	} catch (err) {
// 		return next(err);
// 	}
// };

// //get all products of a shop
exports.deleteAdvance = async (req, res, next) => {
	const { id } = req.params.id

	try {
		await Advance.findByIdAndDelete(req.params.id)
		res.json({ message: 'Successfully deleted' })
	} catch (err) {
		return next(err)
	}
}

// get product
exports.getAdvance = async (req, res, next) => {
	const { id } = req.params.id

	try {
		const Advance = await Advance.findById(req.params.id)
		res.json(Advance)
	} catch (err) {
		return next(err)
	}
}

// //get all products of a shop
exports.updateAdvance = async (req, res, next) => {
	const { id } = req.params.id
	try {
		const product = await Advance.findByIdAndUpdate(req.params.id, req.body, {
			new: true
		})

		res.json({ Advance: product })
	} catch (err) {
		return next(err)
	}
}
// exports.getWishList = async (req, res, next) => {
// 	const {id} = req.params
// 	try {
// 		let products = await ProductModel.find();
// 		products = products.filter(product => product.likes.includes(id))
// 		res.json(products);
// 	} catch (err) {
// 		return next(err);
// 	}
// };

// exports.getFruits = async (req, res, next) => {
// 	console.log('api works');
// 	try {
// 		const products = await ProductModel.find({category:"fruits"});
// 		console.log(products);
// 		res.json(products);
// 	} catch (err) {
// 		return next(err);
// 	}
// };

// exports.getFruit = async (req, res, next) => {
// 	try {
// 		const product = await ProductModel.find({_id:req.params.id});
// 		res.json(product);
// 	} catch (err) {
// 		return next(err);
// 	}
// };

// like and dislike
// exports.toggleLikeBlog = async (req, res) => {
// 	console.log(req.body);

// 	try {
// 		const product = await ProductModel.findById(req.body.blogId);
// 		if (!product.likes.includes(req.body.userId)) {
// 			await product.updateOne({ $push: { likes: req.body.userId } });
// 			// if (post.dislikes.includes(userId)){
// 			// 	await post.updateOne({ $pull: { dislikes: userId } });
// 			// }
// 			res.status(200).json({ status: 'Product Liked',item:product });
// 		} else {
// 			await product.updateOne({ $pull: { likes: req.body.userId } });
// 			res.status(200).json({ status: 'Product UnLiked',item:product });
// 		}
// 	} catch (error) {
// 		res.status(500).json({ status: 'Error with Like', error: error.message });
// 	}
// };

// //buy a product and put pending list
// exports.buyProduct = async (req, res) => {
// 	try{
// 		let product = await ProductModel.findById(req.body.productId)
// 		let user = await User.findById(req.body.userId)
// 		// if(product.pending.find(pro => pro.userId === req.body.userId)){
// 			// await product.updateOne({$pull:{pending:{userId:req.body.userId}}})
// 			// await product.updateOne({ $push: { pending: { user:{...user},count:+req.body.count + +product.pending.find(pro => pro.userId === req.body.userId).count} } });
// 			// console.log(product);
// 			// res.json({message:"Successfully Added next"})
// 		// } else{
// 			await product.updateOne({ $push: { pending: {id:uuid(), user:{...user},count:+req.body.count} } });
// 			console.log(product);

// 			res.json({message:"Successfully Added"})

// 		// }

// 	} catch (error) {
// 		res.status(500).json({ status: 'Error with buy', error: error.message });
// 	}
// };

// //accept the request and put into orders in user
// exports.acceptBuyProduct = async (req, res) => {
// 	try{
// 		let product = await ProductModel.findById(req.body.productId)
// 		let userData = await User.findById(req.body.userId)
// 		const data = product.pending.find(pro => pro.id === req.params.id)
// 		console.log(req.body);
// 		if(product.pending.find(pro => pro.id === req.params.id)){
// 			await product.updateOne({$pull:{pending:{id:req.params.id}}})
// 			await userData.updateOne({ $push: { orders: {id:req.params.id, product:{...product._doc},count:+data.count} } });
// 			await product.updateOne({ $push: { processing: {...data} }});

// 			res.json({message:"Successfully Accepted",pending:product.pending,processing:product.processing,userOrders:userData.orders})
// 		} else{
// 			res.json({message:"You have not requested!"})

// 		}

// 	} catch (error) {
// 		res.status(500).json({ status: 'Error with acceptBuyProduct', error: error.message });
// 	}
// };

// //get all the pending request
// exports.getPendingProducts =  async(req,res,next) => {

// 	try{
// 		const products = await ProductModel.find()

// 		let pendingList = [];

// 		for(let product of products) {
// 			if(product.pending.length > 0) {
// 				for(let pro of product.pending){
// 					pro = {...pro, product:{...product._doc}}
// 					pendingList.push(pro)
// 				}
// 			}
// 		}

// 		res.json({message:"Pending List",products:pendingList})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with getPendingProducts', error: error.message });
// 	}
// }

// //get all the orders of user
// exports.getOrders =  async(req,res,next) => {

// 	try{
// 		const user = await User.findById(req.params.id)

// 		res.json({message:"order List",orders:user.orders})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with getOrders', error: error.message });
// 	}
// }

// //get all the process of products
// exports.getProcessingList =  async(req,res,next) => {

// 	try{
// 		const products = await ProductModel.find()

// 		let processingList = [];

// 		for(let product of products) {
// 			if(product.processing.length > 0) {
// 				for(let pro of product.processing){
// 					pro = {...pro, product:{...product._doc}}
// 					processingList.push(pro)
// 				}
// 			}
// 		}

// 		res.json({message:"ProcessingList List",products:processingList})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with getProcessingList', error: error.message });
// 	}
// }

// //finish Processing of products
// exports.finishProcessing =  async(req,res,next) => {

// 	try{
// 		let product = await ProductModel.findById(req.body.productId)
// 		let userData = await User.findById(req.body.userId)

// 		if(product.processing.find(pro => (pro.id === req.params.id))){
// 			const data = product.processing.find(pro => (pro.id === req.params.id))
// 			await product.updateOne({$pull:{processing:{id:req.params.id}}})
// 			await product.updateOne({ $push: { ship: { ...data} } });

// 			res.json({message:"Successfully shipped",processing:product.processing,ship:product.ship})
// 		} else{
// 			res.json({message:"ship problem!"})

// 		}

// 	} catch (error) {
// 		res.status(500).json({ status: 'Error with finishProcessing', error: error.message });
// 	}
// }

// //get all the ship list of products
// exports.getShipList =  async(req,res,next) => {

// 	try{
// 		const products = await ProductModel.find()

// 		let shipList = [];

// 		for(let product of products) {
// 			if(product.ship.length > 0) {
// 				for(let pro of product.ship){
// 					pro = {...pro, product:{...product._doc}}

// 					shipList.push(pro)
// 				}
// 			}
// 		}

// 		res.json({message:"ShipList List",products:shipList})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with getShipList', error: error.message });
// 	}
// }

// //get all the cancel list of products
// exports.getCancelList =  async(req,res,next) => {

// 	try{
// 		const products = await ProductModel.find()

// 		let shipList = [];

// 		for(let product of products) {
// 			if(product.cancel.length > 0) {
// 				for(let pro of product.cancel){
// 					pro = {...pro, product:{...product._doc}}
// 					shipList.push(pro)
// 				}
// 			}
// 		}

// 		res.json({message:"CancelList List",products:shipList})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with CancelList', error: error.message });
// 	}
// }

// //get all the cancel list of products
// exports.getUserCancelList =  async(req,res,next) => {

// 	try{
// 		const products = await ProductModel.find()

// 		let shipList = [];

// 		for(let product of products) {
// 			if(product.cancel.length > 0) {
// 				for(let pro of product.cancel){
// 					if(pro.user._id === req.params.id)
// 					{
// 						pro = {...pro, product:{...product._doc}}
// 						shipList.push(pro)
// 					}

// 				}
// 			}
// 		}
// 		console.log(shipList);
// 		res.json({message:"CancelList List",products:shipList})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with getUserCancelList', error: error.message });
// 	}
// }

// //cancel a request
// exports.cancelOrder =  async(req,res,next) => {

// 	try{
// 		let product = await ProductModel.findById(req.body.productId)
// 		let userData = await User.findById(req.body.userId)
// 		let cancelExist = false
// 		if(product.ship.find(pro => (pro.id === req.params.id))){
// 			console.log('ship');
// 			const data = product.ship.find(pro => (pro.id === req.params.id))
// 			await product.updateOne({$pull:{ship:{id:req.params.id}}})
// 			if(data) {
// 				await product.updateOne({ $push: { cancel: { ...data} } });
// 				cancelExist = true
// 			}

// 			// res.json({message:"Successfully shipped"})
// 		}

// 		if(product.processing.find(pro => (pro.id === req.params.id))){
// 			console.log('processing');
// 			const data = product.processing.find(pro => (pro.id === req.params.id))

// 			await product.updateOne({$pull:{processing:{id:req.params.id}}})
// 			if(!cancelExist) {
// 				await product.updateOne({ $push: { cancel: { ...data} } });
// 				cancelExist = true
// 			}
// 		}

// 		if(product.pending.find(pro => (pro.id === req.params.id))){
// 			console.log('pending');
// 			const data = product.pending.find(pro => (pro.id === req.params.id))

// 			await product.updateOne({$pull:{pending:{id:req.params.id}}})
// 			if(!cancelExist) {
// 				await product.updateOne({ $push: { cancel: { ...data} } });
// 				cancelExist = true
// 			}
// 		}

// 		if(userData.orders.find(pro => (pro.id === req.params.id))){
// 			console.log('orders');
// 			await userData.updateOne({$pull:{orders:{id:req.params.id}}})
// 		}

// 		res.json({message:"Canceled",ship:product.ship,processing:product.processing,pending:product.pending,orders:userData.orders})
// 	} catch (error) {
// 		res.status(500).json({ status: 'Error with cancelOrder', error: error.message });
// 	}
// }

// //finish shipping of products
// // put into shipped
// //remove from orders
// //remove from ship
// exports.finishShipping =  async(req,res,next) => {

// 	try{
// 		let product = await ProductModel.findById(req.body.productId)
// 		let userData = await User.findById(req.body.userId)

// 		if(product.ship.find(pro => (pro.id === req.params.id))){
// 			const data = product.ship.find(pro => (pro.id === req.params.id))
// 			await product.updateOne({$pull:{ship:{id:req.params.id}}})
// 			await userData.updateOne({$pull:{orders:{id:req.params.id}}})
// 			await userData.updateOne({ $push: { shipped: {id:req.params.id,product:{...product._doc},count:data.count} } });

// 			res.json({message:"Successfully finish shipping",ship:product.ship,orders:userData.orders,shipped:userData.shipped})
// 		} else{
// 			res.json({message:"ship problem!"})
// 		}

// 	} catch (error) {
// 		res.status(500).json({ status: 'Error with finishShipping', error: error.message });
// 	}
// }
// //get all shipped
// exports.getAllShipped =  async(req,res,next) => {

// 	try{
// 		const users = await User.find()

// 		let shipList = [];

// 		for(let user of users) {
// 			if(user.shipped.length > 0) {
// 				for(let pro of user.shipped){
// 					pro = {...pro, user:{...user._doc}}

// 					shipList.push(pro)
// 				}
// 			}
// 		}

// 		res.json({message:"Shipped List",products:shipList})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with getAllShipped', error: error.message });
// 	}
// }

// //all shipped of a user
// exports.getUserShipped =  async(req,res,next) => {
// 	try{
// 		const user = await User.findById(req.params.id)

// 		let shipList = [];

// 		shipList.push(...user.shipped)

// 		res.json({message:"user Shipped List",products:shipList})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with getUserShipped', error: error.message });
// 	}
// }

// //return shipping of products
// // put into returns

// exports.returnProduct =  async(req,res,next) => {

// 	try{
// 		let product = await ProductModel.findById(req.body.productId)
// 		let userData = await User.findById(req.body.userId)

// 		if(userData.shipped.find(pro => (pro.id === req.params.id))){
// 			const data = userData.shipped.find(pro => (pro.id === req.params.id))
// 			await userData.updateOne({ $push: { returns: { ...data} } });

// 			res.json({message:"Successfully returned",product:userData.returns})
// 		} else{
// 			res.json({message:"returnProduct problem!"})

// 		}

// 	} catch (error) {
// 		res.status(500).json({ status: 'Error with returnProduct', error: error.message });
// 	}
// }

// //all returns
// exports.getReturns =  async(req,res,next) => {

// 	try{
// 		const users = await User.find()

// 		let shipList = [];

// 		for(let user of users) {
// 			if(user.returns.length > 0) {
// 				for(let pro of user.shipped){
// 					pro = {...pro, user:{...user._doc}}
// 					shipList.push(pro)
// 				}
// 			}
// 		}

// 		res.json({message:"returns List",products:shipList})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with getReturns', error: error.message });
// 	}
// }

// //all returns of a user
// exports.getUserReturns =  async(req,res,next) => {

// 	try{
// 		const user = await User.findById(req.params.id)

// 		let shipList = [];

// 		shipList.push(...user.returns)

// 		res.json({message:"user returns List",products:shipList})
// 	}catch (error) {
// 		res.status(500).json({ status: 'Error with getUserReturns', error: error.message });
// 	}
// }

// const getTrends = async (req, res, next) => {
// 	let trends;

// 	try {
// 		trends = await Trend.find();
// 	} catch (err) {
// 		return next(err);
// 	}

// 	res.status(200).json(
// 		trends
// 	);
// };

// const getTrend = async (req, res, next) => {
// 	const { id } = req.params;
// 	let trend;
// 	try {
// 		trend = await Trend.findById(id);
// 	} catch (err) {
// 		return next(err);
// 	}
// 	res.status(201).json(trend);
// };

// const deleteTrend = async (req, res, next) => {
// 	const id = req.params.id;
// 	let trend;
// 	try {
// 		trend = await Trend.findById(id);
// 	} catch (err) {
// 		return next(err);
// 	}

// 	try {
// 		await trend.remove();
// 	} catch (err) {
// 		return next(err);
// 	}
// 	res.status(200).json({ message: 'Deleted trend' });
// };

// const updateTrend = async (req, res, next) => {
// 	const { desc, title, image } = req.body;
// 	const id = req.params.id;
// 	let trend;
// 	try {
// 		trend = await Trend.findById(id);
// 	} catch (err) {
// 		return next(err);
// 	}

// 	trend.title = title;
// 	trend.desc = desc;
// 	trend.image = image;

// 	try {
// 		await trend.save();
// 	} catch (err) {
// 		return next(err);
// 	}

// 	res.status(200).json(
// 		trend
// 	);
// };

// exports.getTrends = getTrends;
// exports.getTrend = getTrend;
// exports.createTrend = createTrend;
// exports.updateTrend = updateTrend;
// exports.deleteTrend = deleteTrend;
