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

// Create example account
app.get('/createFoo', (req, res) => {
  let newUser = new User({username: 'foo', password: 'bar'})
  newUser.save(err => {
    if (err) return res.status(500).json({success: false})
    res.status(200).json({success: true, user: newUser})
  })
})

app.post('/login', (req, res) => {
  // Find a user which match username and password
  User.findOne({username: req.body.username, password: req.body.password}).exec((err, user) => {
    if (err) return res.status(500).json({success: false})
    if (!user) return res.status(404).json({success: false})

    // create a token when login success,
    // client will store this token in local and add to every request to restricted API
    let token = jwt.sign({
      _id: user._id
    }, 'secret', {expiresIn: 60 * 60})
    res.status(200).json({success: true, token})
  })
})

server.listen(process.env.PORT || 8082, function () {
  console.log(`Listen on port ${process.env.PORT || '8082'}`)
})
