const express    = require('express')
const app        = express()
const mongoose   = require('mongoose')
const config     = require('./config.js')
const bodyParser = require('body-parser')
const morgan     = require('morgan')

const User = require('./user.model.js')
const jwt  = require('jsonwebtoken')

let server = require('http').createServer(app)

// Connect to MongoDB database
mongoose.connect(config.db, function(err) {
  if (err) {
    console.log('Error when connect MongoDB')
  } else {
    console.log('Connected to MongoDB!')
  }
})

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.use(morgan('dev'))

app.get('/greeting', (req, res) => {
  res.status(200).json({success: true, msg: 'Hello!'})
})

server.listen(process.env.PORT || 8082, function () {
  console.log(`Listen on port ${process.env.PORT || '8082'}`)
})
