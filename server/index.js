const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

mongoose.set('strictQuery', true)

mongoose.connect(process.env.MongoUrl, { useNewUrlParser: true }, err => {
	if (err) return console.log(err)

	console.log('db connected')
})

app.get('/', (req, res) => {
	return res.send('server is running')
})

const User = mongoose.model('banking', {
	name: String,
	email: String,
	balance: Number,
})

app.get('/allusers', (req, res) => {
	User.find({}, (err, docs) => {
		if (err) return res.send({ msg: 'Users not found' })

		return res.send(docs)
	})
})

const Transfer = mongoose.model('bankingtransfer', {
	senderName: String,
	senderEmail: String,
	receiverName: String,
	receiverEmail: String,
	amount: Number,
})

app.post('/transferMoney', (req, res) => {
	const sender = req.body.sender
	const receiver = req.body.receiver

	let transfer = [true, true]

	if (sender && receiver) {
		User.updateOne(
			{ name: sender.name, email: sender.email },
			{ balance: parseInt(sender.balance) - parseInt(receiver.amount) },
			(err, docs) => {
				if (err) return res.sendStatus(400)

				transfer[0] = true
			}
		)
		User.updateOne(
			{ name: receiver.name, email: receiver.email },
			{ balance: parseInt(receiver.balance) + parseInt(receiver.amount) },
			(err, docs) => {
				if (err) return res.sendStatus(400)

				transfer[1] = true
			}
		)

		if (transfer[0] === true && transfer[1] === true) {
			User.findOne({ name: sender.name, email: sender.email }, (err, docs) => {
				if (err) return res.sendStatus(400)

				const record = new Transfer({
					senderName: sender.name,
					senderEmail: sender.email,
					receiverName: receiver.name,
					receiverEmail: receiver.email,
					amount: parseInt(receiver.amount),
				})

				record.save((err, d) => {
					if (err) return res.sendStatus(400)

					res.send({ msg: 'Transfer is complete', remaningBalance: docs.balance })
				})
			})
		}
	} else {
		res.send({ msg: 'bad Request' })
	}
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log('Application is alive'))
