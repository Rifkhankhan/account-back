const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const cors = require('cors')
const fs = require('fs')
const mysql = require('mysql')
// deploy
const ws = require('ws')
// deploy

app.use(express.static('public'))
// limiting image size to 50mb
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

app.use(express.static(__dirname + '/'))

const ExpanseRouter = require('./Routes/ExpanseRouter')
const AccountRequestRouter = require('./Routes/AccountRequestRouter')
const AdvanceRouter = require('./Routes/AdvanceRouter')
const LoanRouter = require('./Routes/LoanRouter')
const ReceiptRouter = require('./Routes/ReceiptRouter')
const userrouter = require('./Routes/userrouter')
const AccountRequestModel = require('./Models/AccountRequestModel')

//need to uncommand to deploy
app.use(
	cors({
		origin: 'https://hopper-front.vercel.app/'
	})
)

app.use(express.static(path.join(__dirname + '/Public')))

//need to uncommand to deploy
// deploy
const wsServer = new ws.Server({
	server: app.listen(3000),
	host: 'localhost',
	path: '/'
})

wsServer.on('connection', w => {
	console.log('someone connected')
	w.on('message', msg => {
		console.log('got message', msg)
		w.send(msg)
	})
})

// deploy
app.use((err, req, res, next) => {
	if (req.file) {
		fs.unlink(req.file.path, err => {
			console.log(err)
		})
	}
})
// connect mongodb
const PORT = process.env.PORT || 5000

mongoose
	.connect(
		'mongodb+srv://rifkhan:d3CnbCKG7klNuZ3m@cluster0.jh4wxm5.mongodb.net/?retryWrites=true&w=majority'
	)
	.then(() => {
		console.log('connected to Database')
		app.listen(PORT) // start Node + Express server on port 5000
	})
	.catch(error => {
		console.log(error)
	})

app.use(bodyParser.json()) // to get body ,this should be used before routers
app.use(bodyParser.urlencoded({ extended: false }))

// app.use('/uploads', express.static(path.join('Server/uploads')));
app.use(express.static(__dirname + '/'))
// CORS Headers => Required for cross-origin/ cross-server communication
app.use((req, res, next) => {
	// middleware
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, OPTIONS'
	)
	next()
})

// here route should be mentioned

app.use('/expanse', ExpanseRouter)
app.use('/accountRequest', AccountRequestRouter)
app.use('/user', userrouter)
app.use('/receipt', ReceiptRouter)
app.use('/loan', LoanRouter)
app.use('/advance', AdvanceRouter)

// for unsupported router error handler
app.use((error, req, res, next) => {
	return next(error)
})

// after using all routes
app.use((error, req, res, next) => {
	if (res.sendHeader) {
		return next(error)
	}
	res
		.status(error.code || 500)
		.json({ message: error.message || 'An Unknown Error Occurred!' })
})
